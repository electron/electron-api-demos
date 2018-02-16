const {app, dialog, globalShortcut} = require('electron')

app.on('ready', () => {
  globalShortcut.register('CommandOrControl+Alt+K', () => {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success!',
      detail: 'You pressed the registered global shortcut keybinding.',
      buttons: ['OK']
    })
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
