const shell = require('electron').shell

const exLinksBtn = document.getElementById('open-ex-links')

exLinksBtn.addEventListener('click', function (event) {
  shell.openExternal('http://electron.atom.io')
})
