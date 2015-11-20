var ipc = require('electron').ipcMain;
var dialog = require('dialog');
var BrowserWindow = require('browser-window');

module.exports = function OpenFileDialogMainProcess () {
  ipc.on('open-error-dialog', function (event) {
    var window = BrowserWindow.fromWebContents(event.sender)
    dialog.showErrorBox("An Error Message", "Demonstrating an error message.")
  });
}
