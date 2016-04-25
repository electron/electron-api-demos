const clipboard = require('electron').clipboard

const copyBtn = document.getElementById('copy-to')
const copyInput = document.getElementById('copy-to-input')

copyBtn.addEventListener('click', function () {
  if (copyInput.value !== '') copyInput.value = ''
  copyInput.placeholder = 'Copied! Paste here to see.'
  clipboard.writeText('Electron Demo!')
})
