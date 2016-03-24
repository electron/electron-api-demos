var ipc = require('electron').ipcMain
var dialog = require('electron').dialog

module.exports.setup = function () {
  ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({properties: ['openFile', 'openDirectory']}, function (files) {
      if (files) { event.sender.send('selected-directory', files); }
    })
  })
}
