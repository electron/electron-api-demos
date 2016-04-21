var BrowserWindow = require('electron').remote.BrowserWindow
var dialog = require('electron').remote.dialog

var path = require('path')

var processCrashBtn = document.getElementById('process-crash')

processCrashBtn.addEventListener('click', function (event) {
  var crashWinPath = path.join('file://', __dirname, '../../sections/windows/process-crash.html')
  var win = new BrowserWindow({ width: 400, height: 320 })

  win.webContents.on('crashed', function () {
    var options = {
      type: 'info',
      title: 'Renderer Process Crashed',
      message: "This process has crashed.",
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function (index) {
      if (index === 0) win.reload()
      else win.close()
    })
  })

  win.on('closed', function () { win = null })
  win.loadURL(crashWinPath)
  win.show()
})
