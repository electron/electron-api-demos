var fs = require('fs')
var path = require('path')

var codeBlocksWithPaths = document.querySelectorAll('code[data-path]')
Array.prototype.forEach.call(codeBlocksWithPaths, function (code) {
  var codePath = code.dataset.path
  code.textContent = fs.readFileSync(path.join(__dirname, '..', codePath))
})

document.addEventListener('DOMContentLoaded', function () {
  var highlight = require('highlight.js')
  var codeBlocks = document.querySelectorAll('pre code')
  Array.prototype.forEach.call(codeBlocks, function (code) {
    highlight.highlightBlock(code)
  })
})
