var trayBtn = document.getElementById('put-in-tray');
var ipc = require('electron').ipcRenderer;

trayBtn.addEventListener('click', function (event) {
  ipc.send('put-in-tray')
  var message = "The tray icon will be removed in 1 minute.";
  document.getElementById('tray-countdown').innerHTML = message;
});
