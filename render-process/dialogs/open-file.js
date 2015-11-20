var selectDirBtn = document.getElementById('select-directory');
var ipc = require('electron').ipcRenderer;

selectDirBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-file-dialog');
});
