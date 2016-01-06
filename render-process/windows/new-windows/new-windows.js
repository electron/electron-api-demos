var BrowserWindow = require('electron').remote.BrowserWindow;
var ipc = require('electron').ipcRenderer;
var path = require('path');

var newWindowBtn = document.getElementById('new-window');

newWindowBtn.addEventListener('click', function (event) {
  console.log('got click')
  var win = new BrowserWindow({ width: 400, height: 400, show: true });
  win.on('closed', function() {
    win = null;
  });
  var modalPath = 'file://' + path.join(process.cwd(), 'sections/windows/modal.html')
  console.log('path', modalPath)
  win.loadURL(modalPath);
  win.show();
});
