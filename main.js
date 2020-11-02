require('update-electron-app')({
  logger: require('electron-log')
})

const path = require('path')
const glob = require('glob')
const {app, BrowserWindow} = require('electron')

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName('Electron APIs')

let mainWindow = null

function initialize () {
  makeSingleInstance()

  loadDemos()

  function createWindow () {
    // https://www.electronjs.org/docs/api/browser-window
    const windowOptions = {
      width: 1080,
      minWidth: 680,
      height: 840,
      // title: app.getName(),                // (electron) 'getName function' is deprecated and will be removed. Please use 'name property' instead.
      title: app.name,
      webPreferences: {
        nodeIntegration: true,                // will let you access node everywhere. security concern? for a desktop app? i doubt it.
        worldSafeExecuteJavaScript: true,     // (electron) Security Warning: webFrame.executeJavaScript was called without worldSafeExecuteJavaScript enabled. This is considered unsafe. worldSafeExecuteJavaScript will be enabled by default in Electron 12.
        enableRemoteModule: true,             // https://github.com/nathanbuchar/electron-settings For Electron v10+, if you want to use electron-settings within a browser window, be sure to set the enableRemoteModule web preference to true. Otherwise you might get the error Cannot read property 'app' of undefined
      }
    }

    if (process.platform === 'linux') {
      windowOptions.icon = path.join(__dirname, '/assets/app-icon/png/512.png')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.loadURL(path.join('file://', __dirname, '/index.html'))

    // Launch fullscreen with DevTools open, usage: npm run debug
    if (debug) {
      mainWindow.webContents.openDevTools()
      mainWindow.maximize()
      // https://github.com/electron/electron/issues/22117
      // https://github.com/electron/electron/issues/23662
      // require('devtron').install()
    }

    mainWindow.on('closed', () => {
      mainWindow = null
    })
  }

  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadDemos () {
  const files = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
  files.forEach((file) => { require(file) })
}

initialize()
