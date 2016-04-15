var versionInfoBtn = document.getElementById('version-info')

var electronVersion = process.versions.electron

versionInfoBtn.addEventListener('click', function () {
  var message = 'This app is using Electron version: ' + electronVersion
  document.getElementById('got-version-info').innerHTML = message
})
