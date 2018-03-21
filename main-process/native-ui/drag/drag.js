const {ipcMain} = require('electron')
const path = require('path')

ipcMain.on('ondragstart', (event, filepath) => {
  const iconName = 'codeIcon'
  event.sender.startDrag({
    file: filepath,
    icon: path.join(__dirname, iconName)
  })
})
