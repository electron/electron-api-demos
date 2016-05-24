const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain
const app = electron.app
const Tray = electron.Tray

let appIcon = null

ipc.on('put-in-tray', function (event) {
  const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png'
  const iconPath = path.join(__dirname, iconName)
  appIcon = new Tray(iconPath)
  const contextMenu = electron.Menu.buildFromTemplate([{
    label: 'Remove',
    click: function (menuItem, browserWindow) {
      event.sender.send('tray-removed')
      appIcon.destroy()
    }
  }])
  appIcon.setToolTip('Electron Demo in the tray.')
  appIcon.setContextMenu(contextMenu)
})

ipc.on('remove-tray', function () {
  appIcon.destroy()
})

app.on('window-all-closed', function () {
  appIcon.destroy()
})
