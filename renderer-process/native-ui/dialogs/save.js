var ipc = require('electron').ipcRenderer;

var saveBtn = document.getElementById('save-dialog');

saveBtn.addEventListener('click', function (event) {
  ipc.send('save-dialog');
});

ipc.on('saved-file', function (event, path) {
  document.getElementById('file-saved').innerHTML = 'Path selected: ' + path;
});
