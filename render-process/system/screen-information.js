var electronScreen = require('screen');
var screenInfoBtn = document.getElementById('screen-info');

var size = electronScreen.getPrimaryDisplay().workAreaSize;
var message = "Your screen is: " + size.width + 'px x ' + size.height + 'px';

screenInfoBtn.addEventListener('click', function () {
  document.getElementById('got-screen-info').innerHTML = message;
});
