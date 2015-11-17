var saveBtn = document.getElementById('save-dialog');
var ipc = require('ipc');

saveBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('save-dialog')
  // add sheet
});
