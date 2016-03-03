var path = require('path');

var BrowserWindow = require('electron').remote.BrowserWindow;

var manageWindowBtn = document.getElementById('manage-window');

manageWindowBtn.addEventListener('click', function (event) {
  var modalPath = 'file://' + path.join(process.cwd(), 'sections/windows/manage-modal.html');
  var win = new BrowserWindow({ width: 400, height: 225 });

  win.on('move', function () {
    setTimeout(function () {
      win.center();
    }, 250);
  });

  win.on('closed', function () { win = null; });
  win.loadURL(modalPath);
  win.show();
});
