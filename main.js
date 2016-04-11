const path = require('path')
const glob = require('glob')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const autoUpdater = require('./auto-updater')
var app = electron.app

electron.hideInternalModules()
process.throwDeprecation = true

var mainWindow = null

function initialize () {
  // Require and setup each JS file in the main-process dir
  glob(path.join(__dirname, 'main-process/**/*.js'), function (error, files) {
    if (error) return console.log(error)
    files.forEach(function (file) {
      require(file)
    })
    autoUpdater.updateMenu()
  })

  function createWindow () {
    var iconPath = path.join(__dirname, '/assets/app-icon/png/512.png')
    mainWindow = new BrowserWindow({ width: 1080, minWidth: 680, height: 800, icon: iconPath })
    mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))
    mainWindow.on('closed', function () {
      mainWindow = null
    })
  }

  app.on('ready', function () {
    createWindow()
    autoUpdater.initialize()
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', function () {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Handle Squirrel on Windows startup events
switch (process.argv[1]) {
  case '--squirrel-install':
  case '--squirrel-obsolete':
  case '--squirrel-updated':
  case '--squirrel-uninstall':
    app.quit()
    break
  default:
    initialize()
}
