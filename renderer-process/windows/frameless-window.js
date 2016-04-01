var BrowserWindow = require('electron').remote.BrowserWindow
var newWindowBtn = document.getElementById('frameless-window')

newWindowBtn.addEventListener('click', function (event) {
  var modalPath = `file://${__dirname}/sections/windows/modal.html`
  var win = new BrowserWindow({ frame: false })
  win.on('closed', function () { win = null })
  win.loadURL(modalPath)
  win.show()
})
