var exLinksBtn = document.getElementById('open-ex-links');
var shell = require('electron').shell;

exLinksBtn.addEventListener('click', function (event) {
  shell.openExternal('http://electron.atom.io');
});
