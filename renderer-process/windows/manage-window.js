var BrowserWindow = require('electron').remote.BrowserWindow
var path = require('path')

var manageWindowBtn = document.getElementById('manage-window')

manageWindowBtn.addEventListener('click', function (event) {
  var modalPath = path.join('file://', __dirname, '../../sections/windows/manage-modal.html')
  var win = new BrowserWindow({ width: 400, height: 275 })

  win.on('resize', updateReply)
  win.on('move', updateReply)
  win.on('closed', function () { win = null })
  win.loadURL(modalPath)
  win.show()

  function updateReply () {
    var mangageWindowReply = document.getElementById('manage-window-reply')
    var message = 'Size: ' + win.getSize() + ' Position: ' + win.getPosition()

    mangageWindowReply.innerText = message
  }
})
