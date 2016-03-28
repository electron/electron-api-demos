var ipc = require('electron').ipcMain
var dialog = require('electron').dialog

module.exports.setup = function () {
  ipc.on('open-error-dialog', function (event) {
    dialog.showErrorBox('An Error Message', 'Demonstrating an error message.')
  })
}
