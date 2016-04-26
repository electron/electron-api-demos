var BrowserWindow = require('electron').remote.BrowserWindow
var dialog = require('electron').remote.dialog

var path = require('path')

var processHangBtn = document.getElementById('process-hang')

processHangBtn.addEventListener('click', function (event) {
  var hangWinPath = path.join('file://', __dirname, '../../sections/windows/process-hang.html')
  var win = new BrowserWindow({ width: 400, height: 320 })

  win.on('unresponsive', function () {
    console.log('unresponsive')
    var options = {
      type: 'info',
      title: 'Renderer Process Hanging',
      message: 'This process is hanging.',
      buttons: ['Reload', 'Close']
    }
    dialog.showMessageBox(options, function (index) {
      if (index === 0) win.reload()
      else win.close()
    })
  })

  win.on('closed', function () { win = null })
  win.loadURL(hangWinPath)
  win.show()
})
