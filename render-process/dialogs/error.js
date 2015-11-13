var errorBtn = document.getElementById('error-dialog');
var ipc = require('ipc');

errorBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-error-dialog')
});
