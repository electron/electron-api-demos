var appInfoBtn = document.getElementById('app-info');

var electronVersion = process.versions.electron;
var message = "This app is using Electron version: " + electronVersion;

appInfoBtn.addEventListener('click', function () {
  document.getElementById('got-app-info').innerHTML = message;
});
