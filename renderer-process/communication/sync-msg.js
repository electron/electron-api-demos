var ipc = require('electron').ipcRenderer

var syncMsgBtn = document.getElementById('sync-msg')

syncMsgBtn.addEventListener('click', function () {
  var reply = ipc.sendSync('synchronous-message', 'ping')
  var message = 'Synchronous message reply: ' + reply
  document.getElementById('sync-reply').innerHTML = message
})
