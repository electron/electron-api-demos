var ipc = require('electron').ipcMain;

module.exports.setup = function () {
  ipc.on('asynchronous-message', function (event, arg) {
    event.sender.send('asynchronous-reply', 'pong');
  });
};
