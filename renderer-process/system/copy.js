var clipboard = require('electron').clipboard;

var copyBtn = document.getElementById('copy-to');
var copyInput = document.getElementById('copy-to-input');

copyBtn.addEventListener('click', function () {
  copyInput.placeholder = 'Copied! Paste here to see.';
  clipboard.writeText('Electron Demo!');
})
