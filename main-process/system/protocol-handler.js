const app = require('electron').app
const dialog = require('electron').dialog
const path = require('path')

// If we are running a non-packaged version of the app
if (process.defaultApp) {
  // If we have the path to our app we set the protocol client to launch electron.exe with the path to our app
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-api-demos', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('electron-api-demos')
}

// NOTE: See the makeSingleInstance function in main.js for reference as to how
//       this event is fired on Windows
app.on('open-url', function (event, url) {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})
