var os = require('os')

var shell = require('electron').shell

var fileMangerBtn = document.getElementById('open-file-manager')

fileMangerBtn.addEventListener('click', function (event) {
  shell.showItemInFolder(os.homedir())
})
