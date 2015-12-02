var ipc = require('electron').ipcMain;
var dialog = require('dialog');

module.exports = function OpenFileDialogMainProcess () {
  ipc.on('open-file-dialog', function (event) {
    var files = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
    if (files) { event.sender.send('selected-directory', files); }
  });
};
