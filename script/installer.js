#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  const rootPath = path.join(__dirname, '..')
  const outPath = path.join(rootPath, 'out')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'ElectronAPIDemos-win32-ia32'),
    // TODO Switch iconUrl to https://raw.githubusercontent.com/electron/electron-api-demos/master/assets/app-icon/win/app.ico
    // once the repository is made public
    iconUrl: 'https://gist.githubusercontent.com/kevinsawicki/9b90f6f8a35c3f3acb6d/raw/67b9015a3be1729145bb9813ff8530c7615fbcf4/app.ico',
    loadingGif: path.join(rootPath, 'assets', 'img', 'loading.gif'),
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    setupExe: 'ElectronAPIDemosSetup.exe',
    setupIcon: path.join(rootPath, 'assets', 'app-icon', 'win', 'app.ico'),
    skipUpdateIcon: true
  })
}

function deleteOutputFolder () {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
      error ? reject(error) : resolve()
    })
  })
}
