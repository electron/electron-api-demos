const shell = require('electron').shell

const os = require('os')

const fileMangerBtn = document.getElementById('open-file-manager')

fileMangerBtn.addEventListener('click', function (event) {
  shell.showItemInFolder(os.homedir())
})
