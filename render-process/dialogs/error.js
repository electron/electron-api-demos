var errorBtn = document.getElementById('error-dialog');
var ipc = require('electron').ipcRenderer;

errorBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-error-dialog');
});
