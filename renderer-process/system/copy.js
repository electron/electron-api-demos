var clipboard = require('electron').clipboard

var copyBtn = document.getElementById('copy-to')
var copyInput = document.getElementById('copy-to-input')

copyBtn.addEventListener('click', function () {
  if (copyInput.value !== '') copyInput.value = ''
  copyInput.placeholder = 'Copied! Paste here to see.'
  clipboard.writeText('Electron Demo!')
})
