var ipc = require('electron').ipcMain;
var dialog = require('dialog');

module.exports.setup = function () {
  ipc.on('open-error-dialog', function (event) {
    dialog.showErrorBox('An Error Message', 'Demonstrating an error message.');
  });
};
