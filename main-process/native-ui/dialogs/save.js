var ipc = require('electron').ipcMain
var dialog = require('electron').dialog

ipc.on('save-dialog', function (event) {
  var options = {
    title: 'Save an Image',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ]
  }
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', filename)
  })
})
