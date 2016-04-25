const ipc = require('electron').ipcRenderer

const errorBtn = document.getElementById('error-dialog')

errorBtn.addEventListener('click', function (event) {
  ipc.send('open-error-dialog')
})
