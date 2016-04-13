var fs = require('fs')
var path = require('path')

var codeBlocks = document.querySelectorAll('code[data-path]')
Array.prototype.forEach.call(codeBlocks, function (code) {
  code.textContent = fs.readFileSync(path.join(__dirname, code.dataset.path))
})
