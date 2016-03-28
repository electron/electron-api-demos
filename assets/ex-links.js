var shell = require('electron').shell
var links = document.querySelectorAll('a[href]')

Array.prototype.forEach.call(links, function (link) {
  var url = link.getAttribute('href')
  if (url.indexOf('http') === 0) {
    link.addEventListener('click', function (e) {
      e.preventDefault()
      shell.openExternal(url)
    })
  }
})
