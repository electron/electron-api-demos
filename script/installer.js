#!/usr/bin/env node

const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const rimraf = require('rimraf')

deleteOutputFolder()
  .then(getInstallerConfig)
  .then(createWindowsInstaller)
  .catch((error) => {
    console.log(error.stack);
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  const outPath = path.join(__dirname, '..', 'out')
  return Promise.resolve({
    appDirectory: path.join(outPath, 'Electron API Demos-win32-ia32'),
    exe: 'Electron API Demos.exe',
    outputDirectory: path.join(outPath, 'windows-installer')
  })
}

function deleteOutputFolder () {
  return new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '..', 'out', 'windows-installer'), (error) => {
      if (error) return reject(error)
      resolve()
    })
  })
}
