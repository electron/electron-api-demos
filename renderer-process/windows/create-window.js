var BrowserWindow = require('electron').remote.BrowserWindow;

var newWindowBtn = document.getElementById('new-window');

newWindowBtn.addEventListener('click', function (event) {
  var modalPath = 'file://' + __dirname + '/sections/windows/modal.html';
  var win = new BrowserWindow({ width: 400, height: 320 });
  win.on('closed', function () { win = null; });
  win.loadURL(modalPath);
  win.show();
});
