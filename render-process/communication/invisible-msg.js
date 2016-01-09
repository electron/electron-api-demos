var remote = require('electron').remote;
var BrowserWindow = remote.BrowserWindow;
var ipcMain = remote.ipcMain;
var path = require('path');

var invisMsgBtn = document.getElementById('invis-msg');

invisMsgBtn.addEventListener('click', function (clickEvent) {
  // var appWindow = BrowserWindow.fromWebContents(clickEvent.sender);
  var appWindowID = BrowserWindow.getFocusedWindow().id

  var invisPath = 'file://' + path.join(process.cwd(), 'sections/communication/invisible.html')
  var win = new BrowserWindow({ width: 400, height: 400, show: true });
  win.loadURL(invisPath);
  console.log("win id:", win.id)
  win.webContents.on('did-finish-load', function (clickEvent) {
    // after invisible page loads, pass the original click event
    // then use that to get the web contents from the main process browser window
    // from there send a message that the invisible window can listen for
    var appWindow = BrowserWindow.fromId(appWindowID)
    console.log("appWindow id:", appWindowID)
    console.log("title", appWindow.webContents.getTitle())
    appWindow.webContents.send('send-ping', 'ping!');
  });
});

ipcMain.on('ping-reply', function (event, arg) {
  var message = "Invisible window reply: " + arg;
  document.getElementById('invis-reply').innerHTML = message;
})
