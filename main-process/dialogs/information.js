var ipc = require('electron').ipcMain;
var dialog = require('dialog');
var BrowserWindow = require('browser-window');

module.exports = function OpenFileDialogMainProcess () {
  ipc.on('open-information-dialog', function (event) {
    var window = BrowserWindow.fromWebContents(event.sender);
    var options = {
      'type': 'info',
      'title': 'Information',
      'message': "This is an information dialog. Isn't it nice?",
      'buttons': ['Yes', 'No']
    };
    dialog.showMessageBox(window, options, (index) => {
      event.sender.send('information-dialog-selection', index);
    });
  });
};
