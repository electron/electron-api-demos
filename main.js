const path = require('path')
const glob = require('glob')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
var app = electron.app
var mainWindow = null

electron.hideInternalModules()
process.throwDeprecation = true

// Require and setup each JS file in the main-process dir
glob(path.join(__dirname, 'main-process/**/*.js'), function (error, files) {
  if (error) return console.log(error)
  files.forEach(function (file) {
    require(file)
  })
})

function createWindow () {
  var iconPath = path.join(__dirname, '/assets/app-icon/png/512.png')
  mainWindow = new BrowserWindow({ width: 1080, minWidth: 680, height: 800, icon: iconPath })
  mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'))
  BrowserWindow.addDevToolsExtension(path.join(__dirname, 'assets/accessibility-devtools'))
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

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
