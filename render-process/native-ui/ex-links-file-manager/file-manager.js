var fileMangerBtn = document.getElementById('open-file-manager');
var shell = require('electron').shell;

fileMangerBtn.addEventListener('click', function (event) {
  shell.showItemInFolder('/');
});
