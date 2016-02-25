var printPDFBton = document.getElementById('print-pdf');
var ipc = require('electron').ipcRenderer;

printPDFBton.addEventListener('click', function (event) {
  ipc.send('print-to-pdf');
});

ipc.on('wrote-pdf', function (event, path) {
  var message = 'Wrote PDF to: ~' + path;
  document.getElementById('pdf-path').innerHTML = message;
});
