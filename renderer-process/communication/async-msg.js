var ipc = require('electron').ipcRenderer

var asyncMsgBtn = document.getElementById('async-msg')

asyncMsgBtn.addEventListener('click', function () {
  ipc.send('asynchronous-message', 'ping')
})

ipc.on('asynchronous-reply', function (event, arg) {
  var message = 'Asynchronous message reply: ' + arg
  document.getElementById('async-reply').innerHTML = message
})
