const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const globalShortcut = electron.globalShortcut

app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Alt+K', function () {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success! You pressed the registered global shortcut keybinding.',
      buttons: ['Yay']
    })
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
