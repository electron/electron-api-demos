var appInfoBtn = document.getElementById('app-info')

var electronVersion = process.versions.electron

appInfoBtn.addEventListener('click', function () {
  var message = 'This app is using Electron version: ' + electronVersion
  document.getElementById('got-app-info').innerHTML = message
})
