var informationBtn = document.getElementById('information-dialog');
var ipc = require('ipc');

informationBtn.addEventListener('click', function clickedDir (event) {
  console.log('click')
  ipc.send('open-information-dialog')
});
