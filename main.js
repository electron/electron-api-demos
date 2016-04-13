const path = require('path')
const glob = require('glob')
const electron = require('electron')
const autoUpdater = require('./auto-updater')

const BrowserWindow = electron.BrowserWindow
const app = electron.app

const debug = /--debug/.test(process.argv[2])

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
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
    }

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
