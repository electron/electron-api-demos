var fs = require('fs')
var highlight = require('highlight.js')
var path = require('path')

var codeBlocks = document.querySelectorAll('code[data-path]')
Array.prototype.forEach.call(codeBlocks, function (code) {
  var codePath = code.dataset.path
  code.textContent = fs.readFileSync(path.join(__dirname, '..', codePath))
  highlight.highlightBlock(code)
})
