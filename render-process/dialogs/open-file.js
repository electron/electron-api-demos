var selectDirBtn = document.getElementById('select-directory');
var ipc = require('ipc');

selectDirBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-file-dialog')
  // add sheet
});
