var ipc = require('electron').ipcMain;
var BrowserWindow = require('browser-window');
var fs = require('fs');

module.exports.setup = function () {
  ipc.on('print-to-pdf', function (event) {
    var win = BrowserWindow.getFocusedWindow()
    // Use default printing options
    win.webContents.printToPDF({}, function(error, data) {
      if (error) throw error;
      fs.writeFile("/tmp/print.pdf", data, function(error) {
        if (error)
          throw error;
        event.sender.send('wrote-pdf', "/tmp/print.pdf");
      })
    })
  });
};
