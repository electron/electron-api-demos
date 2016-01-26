var fs = require('fs');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;
var shell = require('shell');

module.exports.setup = function () {
  ipc.on('print-to-pdf', function (event) {
    var pdfPath = "/tmp/print.pdf"
    var win = BrowserWindow.fromWebContents(event.sender)
    // Use default printing options
    win.webContents.printToPDF({}, function(error, data) {
      if (error) throw error;
      fs.writeFile(pdfPath, data, function(error) {
        if (error)
          throw error;
        shell.openItem(pdfPath)
        event.sender.send('wrote-pdf', pdfPath);
      })
    })
  });
};
