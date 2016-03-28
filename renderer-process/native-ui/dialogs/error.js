var ipc = require('electron').ipcRenderer

var errorBtn = document.getElementById('error-dialog')

errorBtn.addEventListener('click', function (event) {
  ipc.send('open-error-dialog')
})
