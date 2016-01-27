var trayBtn = document.getElementById('put-in-tray');
var ipc = require('electron').ipcRenderer;

var trayOn = false

trayBtn.addEventListener('click', function (event) {
  if (trayOn) {
    ipc.send('remove-tray');
  } else {
    trayOn = true
    ipc.send('put-in-tray');
    var message = "Click demo again to remove.";
    document.getElementById('tray-countdown').innerHTML = message;
  }
});
