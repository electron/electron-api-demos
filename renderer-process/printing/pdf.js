var ipc = require('electron').ipcRenderer

var printPDFBtn = document.getElementById('print-pdf')

printPDFBtn.addEventListener('click', function (event) {
  ipc.send('print-to-pdf')
})

ipc.on('wrote-pdf', function (event, path) {
  var message = 'Wrote PDF to: ~' + path
  document.getElementById('pdf-path').innerHTML = message
})
