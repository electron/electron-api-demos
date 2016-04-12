var BrowserWindow = require('electron').remote.BrowserWindow
var ipcRenderer = require('electron').ipcRenderer
var path = require('path')

var invisMsgBtn = document.getElementById('invis-msg')
var invisReply = document.getElementById('invis-reply')

invisMsgBtn.addEventListener('click', function (clickEvent) {
  var windowID = BrowserWindow.getFocusedWindow().id
  var invisPath = 'file://' + path.join(__dirname, 'sections/communication/invisible.html')
  var win = new BrowserWindow({ width: 400, height: 400, show: false })
  win.loadURL(invisPath)

  win.webContents.on('did-finish-load', function (clickEvent) {
    var input = 100
    win.webContents.send('compute-factorial', input, windowID)
  })
})

ipcRenderer.on('factorial-computed', function (event, input, output) {
  var message = 'The factorial of ' + input + ' is: ' + output
  invisReply.textContent = message
})
