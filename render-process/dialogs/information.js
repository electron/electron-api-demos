var informationBtn = document.getElementById('information-dialog');
var ipc = require('electron').ipcRenderer;

informationBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-information-dialog');
});
