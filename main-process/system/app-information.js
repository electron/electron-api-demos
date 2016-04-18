const app = require('electron').app
const ipc = require('electron').ipcMain

ipc.on('get-app-path', function (event) {
  event.sender.send('got-app-path', app.getAppPath())
})
