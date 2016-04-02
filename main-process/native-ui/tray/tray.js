const path = require('path')
var electron = require('electron')
var ipc = electron.ipcMain
appIcon = null

ipc.on('put-in-tray', function (event) {
  var iconPath = path.join(__dirname, '/iconTemplate.png')
  appIcon = new electron.Tray(iconPath)
  var contextMenu = electron.Menu.buildFromTemplate([
    { label: 'Remove',
      click: function (menuItem, browserWindow) {
        event.sender.send('tray-removed')
        appIcon.destroy()
      }
    }
  ])
  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
})

ipc.on('remove-tray', function (event) {
  appIcon.destroy()
})
