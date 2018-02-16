const {ipcMain} = require('electron')

ipcMain.on('synchronous-message', (event, arg) => {
  event.returnValue = 'pong'
})
