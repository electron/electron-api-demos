var fs = require('fs');
var os = require('os');
var path = require('path');

var BrowserWindow = require('electron').BrowserWindow;
var ipc = require('electron').ipcMain;
var shell = require('electron').shell;

module.exports.setup = function () {
  ipc.on('print-to-pdf', function (event) {
    var pdfPath = path.join(os.tmpdir(), 'print.pdf');
    var win = BrowserWindow.fromWebContents(event.sender);
    // Use default printing options
    win.webContents.printToPDF({}, function (error, data) {
      if (error) throw error;
      fs.writeFile(pdfPath, data, function (error) {
        if (error) {
          throw error;
        }
        shell.openItem(pdfPath);
        event.sender.send('wrote-pdf', pdfPath);
      });
    });
  });
};
