var electronScreen = require('electron').screen

var screenInfoBtn = document.getElementById('screen-info')
var size = electronScreen.getPrimaryDisplay().workAreaSize

screenInfoBtn.addEventListener('click', function () {
  var message = 'Your screen is: ' + size.width + 'px x ' + size.height + 'px'
  document.getElementById('got-screen-info').innerHTML = message
})
