var ipc = require('electron').ipcMain;
var dialog = require('dialog');
var BrowserWindow = require('browser-window');

module.exports = function OpenFileDialogMainProcess () {
  ipc.on('open-file-dialog-sheet', function (event) {
    var window = BrowserWindow.fromWebContents(event.sender);
    var files = dialog.showOpenDialog(window, {properties: ['openFile', 'openDirectory']});
    if (files) { event.sender.send('selected-directory', files); }
  });

  ipc.on('open-file-dialog', function (event) {
    var files = dialog.showOpenDialog({properties: ['openFile', 'openDirectory']});
    if (files) { event.sender.send('selected-directory', files); }
  });
};
