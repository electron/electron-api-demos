var electron = require('electron')
var app = electron.app
var dialog = electron.dialog
var globalShortcut = electron.globalShortcut

globalShortcut.register('CommandOrControl+D', function () {
  dialog.showMessageBox({
    type: 'info',
    message: "Success! You hit the CommandOrControl+D",
    buttons: ['Yay']
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
