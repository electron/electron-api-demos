var printPDFBton = document.getElementById('print-pdf');
var ipc = require('electron').ipcRenderer;

printPDFBton.addEventListener('click', function (event) {
  ipc.send('print-to-pdf');
});

ipc.on('wrote-pdf', function (event, path) {
  // TODO should we open the pdf? or put it somewhere else?
  var message = 'Wrote PDF to: ' + path;
  document.getElementById('pdf-path').innerHTML = message;
});
