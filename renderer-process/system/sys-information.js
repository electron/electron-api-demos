var os = require('os')
var homeDir = os.homedir()
var sysInfoBtn = document.getElementById('sys-info')

sysInfoBtn.addEventListener('click', function () {
  var message = 'Your system home directory is: ' + homeDir
  document.getElementById('got-sys-info').innerHTML = message
})
