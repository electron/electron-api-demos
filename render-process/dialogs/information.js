var informationBtn = document.getElementById('information-dialog');
var ipc = require('ipc');

informationBtn.addEventListener('click', function clickedDir (event) {
  ipc.send('open-information-dialog');
});
