var ipc = require('electron').ipcRenderer

var trayBtn = document.getElementById('put-in-tray')
var trayOn = false

trayBtn.addEventListener('click', function (event) {
  if (trayOn) {
    trayOn = false
    document.getElementById('tray-countdown').innerHTML = ''
    ipc.send('remove-tray')
  } else {
    trayOn = true
    var message = 'Click demo again to remove.'
    document.getElementById('tray-countdown').innerHTML = message
    ipc.send('put-in-tray')
  }
})
// Tray removed from context menu on icon
ipc.on('tray-removed', function () {
  trayOn = false
  document.getElementById('tray-countdown').innerHTML = ''
})
