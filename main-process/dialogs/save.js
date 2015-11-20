var ipc = require('electron').ipcMain;
var dialog = require('dialog');
var BrowserWindow = require('browser-window');

module.exports = function OpenFileDialogMainProcess () {
  ipc.on('save-dialog', function (event) {
    var window = BrowserWindow.fromWebContents(event.sender)
    var options = {
      "title": "Save an Image",
      "filters": [
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
      ]
    }
    dialog.showSaveDialog(window, options, (filename) => {
      event.sender.send('saved-file', filename)
    })
  })
}
