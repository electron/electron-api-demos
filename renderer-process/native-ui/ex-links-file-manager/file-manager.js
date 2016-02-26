var fileMangerBtn = document.getElementById('open-file-manager');
var shell = require('electron').shell;
var os = require('os');

fileMangerBtn.addEventListener('click', function (event) {
  shell.showItemInFolder(os.homedir());
});
