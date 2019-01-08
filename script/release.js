#!/usr/bin/env node

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')
const octokit = require('@octokit/rest')

const token = process.env.ELECTRON_API_DEMO_GITHUB_TOKEN
const version = require('../package').version
const github = octokit({
  timeout: 30 * 1000,
  'user-agent': `node/${process.versions.node}`
})

if (!token) {
  console.error('ELECTRON_API_DEMO_GITHUB_TOKEN environment variable not set\nSet it to a token with repo scope created from https://github.com/settings/tokens/new')
  process.exit(1)
}

github.authenticate({
  type: 'token',
  token: token
})

async function doRelease () {
  const release = await getOrCreateRelease()
  const assets = await prepareAssets()
  await uploadAssets(release, assets)
  await publishRelease(release)
  console.log('Done!')
}

doRelease().catch(err => {
  console.error(err.message || err)
  process.exit(1)
})

function prepareAssets () {
  const outPath = path.join(__dirname, '..', 'out')

  const zipAssets = [{
    name: 'electron-api-demos-mac.zip',
    path: path.join(outPath, 'Electron API Demos-darwin-x64', 'Electron API Demos.app')
  }, {
    name: 'electron-api-demos-windows.zip',
    path: path.join(outPath, 'Electron API Demos-win32-ia32')
  }, {
    name: 'electron-api-demos-linux.zip',
    path: path.join(outPath, 'Electron API Demos-linux-x64')
  }]

  return Promise.all(zipAssets.map(zipAsset)).then((zipAssets) => {
    return zipAssets.concat([{
      name: 'RELEASES',
      path: path.join(outPath, 'windows-installer', 'RELEASES')
    }, {
      name: 'ElectronAPIDemosSetup.exe',
      path: path.join(outPath, 'windows-installer', 'ElectronAPIDemosSetup.exe')
    }, {
      name: `electron-api-demos-${version}-full.nupkg`,
      path: path.join(outPath, 'windows-installer', `electron-api-demos-${version}-full.nupkg`)
    }])
  })
}

function zipAsset (asset) {
  return new Promise((resolve, reject) => {
    const assetBase = path.basename(asset.path)
    const assetDirectory = path.dirname(asset.path)
    console.log(`Zipping ${assetBase} to ${asset.name}`)

    if (!fs.existsSync(asset.path)) {
      return reject(new Error(`${asset.path} does not exist`))
    }

    const zipCommand = `zip --recurse-paths --symlinks '${asset.name}' '${assetBase}'`
    const options = {cwd: assetDirectory, maxBuffer: Infinity}
    childProcess.exec(zipCommand, options, (error) => {
      if (error) {
        reject(error)
      } else {
        asset.path = path.join(assetDirectory, asset.name)
        resolve(asset)
      }
    })
  })
}

async function getOrCreateRelease () {
  const { data: releases } = await github.repos.listReleases({
    owner: 'electron',
    repo: 'electron-api-demos',
    per_page: 100,
    page: 1
  })
  const existingRelease = releases.find(release => release.tag_name === `v${version}` && release.draft === true)
  if (existingRelease) {
    console.log(`Using existing draft release for v${version}`)
    return existingRelease
  }

  console.log('Creating new draft release')
  const { data: release } = await github.repos.createRelease({
    owner: 'electron',
    repo: 'electron-api-demos',
    tag_name: `v${version}`,
    target_commitish: 'master',
    name: version,
    body: 'An awesome new release :tada:',
    draft: true,
    prerelease: false
  })
  return release
}

async function uploadAssets (release, assets) {
  for (const asset of assets) {
    if (release.assets.some(ghAsset => ghAsset.name === asset.name)) {
      console.log(`Skipping already uploaded asset ${asset.name}`)
    } else {
      process.stdout.write(`Uploading ${asset.name}... `)
      try {
        await uploadAsset(release, asset)
      } catch (err) {
        if (err.name === 'HttpError' && err.message.startsWith('network timeout')) {
          console.error('\n')
          console.error(`  There was a network timeout while uploading ${asset.name}.`)
          console.error('  This likely resulted in a bad asset; please visit the release at')
          console.error(`  ${release.html_url} and manually remove the bad asset,`)
          console.error(`  then run this script again to continue where you left off.`)
          console.error('')
          process.exit(2)
        } else {
          throw err
        }
      }

      process.stdout.write('Success!\n')
      // [mkt] Waiting a bit between uploads seems to increase success rate
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }
}

function uploadAsset (release, asset) {
  return github.repos.uploadReleaseAsset({
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': fs.statSync(asset.path).size
    },
    url: release.upload_url,
    file: fs.createReadStream(asset.path),
    name: asset.name
  })
}

function publishRelease (release) {
  console.log('Publishing release')
  return github.repos.updateRelease({
    owner: 'electron',
    repo: 'electron-api-demos',
    release_id: release.id,
    draft: false
  })
}
