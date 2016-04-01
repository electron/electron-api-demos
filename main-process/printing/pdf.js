const fs = require('fs')
const os = require('os')
const path = require('path')
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain
const shell = electron.shell

ipc.on('print-to-pdf', function (event) {
  var pdfPath = path.join(os.tmpdir(), 'print.pdf')
  var win = BrowserWindow.fromWebContents(event.sender)
  // Use default printing options
  win.webContents.printToPDF({}, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openItem(pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})
