var os = require('os');
var sysInfoBtn = document.getElementById('sys-info');

var homeDir = os.homedir()

var message = "Your system home directory is: " + homeDir;

sysInfoBtn.addEventListener('click', function () {
  document.getElementById('got-sys-info').innerHTML = message;
});
