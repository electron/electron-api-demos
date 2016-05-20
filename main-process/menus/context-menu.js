const electron = require('electron')
const {BrowserWindow, Menu, MenuItem} = electron
const ipc = electron.ipcMain

let menu = new Menu()

menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

// Show when the window is right clicked.
// Adds event listener to all created windows.
for (const win of BrowserWindow.getAllWindows()) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
}

// Show when the renderer asks for a menu.
ipc.on('show-context-menu', function () {
  menu.popup(BrowserWindow.getFocusedWindow())
})
