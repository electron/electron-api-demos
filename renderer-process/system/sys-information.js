var os = require('os');
var sysInfoBtn = document.getElementById('sys-info');

var homeDir = os.homedir();

sysInfoBtn.addEventListener('click', function () {
  var message = 'Your system home directory is: ' + homeDir;
  document.getElementById('got-sys-info').innerHTML = message;
});
