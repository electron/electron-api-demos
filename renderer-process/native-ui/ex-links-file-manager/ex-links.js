var shell = require('electron').shell

var exLinksBtn = document.getElementById('open-ex-links')

exLinksBtn.addEventListener('click', function (event) {
  shell.openExternal('http://electron.atom.io')
})
