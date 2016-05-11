const clipboard = require('electron').clipboard

const copyBtn = document.getElementById('copy-to')
const copyInput = document.getElementById('copy-to-input')

copyBtn.addEventListener('click', function () {
  clipboard.writeText(copyInput.value || 'Electron Demo!')
  copyInput.value = ''
  copyInput.placeholder = 'Copied! Paste here to see.'
})
