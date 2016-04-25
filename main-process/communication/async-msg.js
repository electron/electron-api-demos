const ipc = require('electron').ipcMain

ipc.on('asynchronous-message', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})
