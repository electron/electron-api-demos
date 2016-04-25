const ipc = require('electron').ipcMain

ipc.on('synchronous-message', function (event, arg) {
  event.returnValue = 'pong'
})
