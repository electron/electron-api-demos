var ipc = require('electron').ipcRenderer;
var syncMsgBtn = document.getElementById('sync-msg');

syncMsgBtn.addEventListener('click', function () {
  var message = "Snchronous message reply: " + ipc.sendSync('synchronous-message', 'ping');
  document.getElementById('sync-reply').innerHTML = message;
});
