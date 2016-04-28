const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const globalShortcut = electron.globalShortcut

app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Alt+D', function () {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success! You hit CommandOrControl+Alt+D',
      buttons: ['Yay']
    })
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
