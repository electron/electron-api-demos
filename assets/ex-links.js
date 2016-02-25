var shell = require('shell');

var links = document.querySelectorAll('a[href]');
Array.prototype.forEach.call(links, function (link) {
  var url = link.getAttribute('href');
  if (url.indexOf('http') > -1) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      shell.openExternal(url);
    });
  }
});
