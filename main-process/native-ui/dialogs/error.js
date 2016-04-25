const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

ipc.on('open-error-dialog', function (event) {
  dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
})
