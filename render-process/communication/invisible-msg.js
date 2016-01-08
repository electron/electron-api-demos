var ipc = require('electron').ipcRenderer;
var BrowserWindow = require('electron').remote.BrowserWindow;
var path = require('path');

var invisMsgBtn = document.getElementById('invis-msg');

invisMsgBtn.addEventListener('click', function (event) {
  console.log('click')
  var invisPath = 'file://' + path.join(process.cwd(), 'sections/communication/invisible.html')
  var win = new BrowserWindow({ width: 0, height: 0, show: false });
  win.loadURL(invisPath);

  ipc.send('send-ping', 'ping');
  console.log("All:", BrowserWindow.getAllWindows(), "invis:", win.id);
});

ipc.on('ping-reply', function (event, arg) {
  console.log("visible site got", arg)
  var message = "Invisible window reply: " + arg;
  document.getElementById('invis-reply').innerHTML = message;
})
