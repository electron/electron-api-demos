var ipc = require('electron').ipcMain;

module.exports.setup = function () {
  ipc.on('synchronous-message', function (event, arg) {
    event.returnValue = 'pong';
  });
};
