var saveBtn = document.getElementById('save-dialog');
var ipc = require('electron').ipcRenderer;

saveBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('save-dialog');
});
