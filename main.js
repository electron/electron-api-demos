var path = require('path')

var app = require('electron').app
var BrowserWindow = require('electron').BrowserWindow

var glob = require('glob')

require('electron').hideInternalModules()
process.throwDeprecation = true

var mainWindow = null

// Require and setup each JS file in the main-process dir
glob(__dirname + '/main-process/**/*.js', function (error, files) {
  if (error) return console.log(error)
  files.forEach(function (file) {
    require(file).setup()
  })
})

function createWindow () {
  var iconPath = path.join(__dirname, '/assets/app-icon/png/512.png')
  mainWindow = new BrowserWindow({ width: 970, 'min-width': 680, height: 900, icon: iconPath })
  mainWindow.loadURL('file://' + __dirname + '/index.html')
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
