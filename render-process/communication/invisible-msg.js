var remote = require('electron').remote;
var BrowserWindow = remote.BrowserWindow;
var ipcMain = remote.ipcMain;
var path = require('path');

var invisMsgBtn = document.getElementById('invis-msg');

invisMsgBtn.addEventListener('click', function (event) {
  console.log('click')
  var invisPath = 'file://' + path.join(process.cwd(), 'sections/communication/invisible.html')
  var win = new BrowserWindow({ width: 0, height: 0, show: false });
  win.loadURL(invisPath);
  win.webContents.on('did-finish-load', function (event) {
    // after invisible page loads, pass the original event
    // then use the main process browser window web contents get the window
    // from the event and then use webcontents to send a message that
    // the invisible window can listen for
    var appWindow = BrowserWindow.fromWebContents(event.sender)
    appWindow.webContents.send('send-ping', 'whoooooooh!');
  });
});

ipcMain.on('ping-reply', function (event, arg) {
  var message = "Invisible window reply: " + arg;
  document.getElementById('invis-reply').innerHTML = message;
})
