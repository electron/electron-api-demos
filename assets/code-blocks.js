var fs = require('fs')
var highlight = require('highlight.js')
var path = require('path')

var codeBlocksWithPaths = document.querySelectorAll('code[data-path]')
Array.prototype.forEach.call(codeBlocksWithPaths, function (code) {
  var codePath = code.dataset.path
  code.textContent = fs.readFileSync(path.join(__dirname, '..', codePath))
})

var codeBlocks = document.querySelectorAll('pre code')
Array.prototype.forEach.call(codeBlocks, function (code) {
  highlight.highlightBlock(code)
})
