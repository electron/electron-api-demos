var clipboard = require('electron').clipboard

var pasteBtn = document.getElementById('paste-to')

pasteBtn.addEventListener('click', function () {
  clipboard.writeText('What a demo!')
  var message = 'Clipboard contents: ' + clipboard.readText()
  document.getElementById('paste-from').innerHTML = message
})
