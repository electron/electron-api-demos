var ipc = require('electron').ipcRenderer

var selectDirBtn = document.getElementById('select-directory')

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-file-dialog')
})

ipc.on('selected-directory', function (event, path) {
  document.getElementById('selected-file').innerHTML = 'You selected: ' + path
})
