var BrowserWindow = require('electron').remote.BrowserWindow;

var manageWindowBtn = document.getElementById('manage-window');

manageWindowBtn.addEventListener('click', function (event) {
  var modalPath = 'file://' + __dirname + '/sections/windows/manage-modal.html';
  var win = new BrowserWindow({ width: 400, height: 225 });

  win.on('resize', updateReply);
  win.on('move', updateReply);

  win.on('closed', function () { win = null; });
  win.loadURL(modalPath);
  win.show();

  function updateReply () {
    var mangageWindowReply = document.getElementById('manage-window-reply');
    var message = 'Size: ' + win.getSize() + ' Position: ' + win.getPosition();

    mangageWindowReply.innerText = message;
  }
});
