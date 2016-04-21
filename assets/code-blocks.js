var fs = require('fs')
var path = require('path')

var codeBlocksWithPaths = document.querySelectorAll('code[data-path]')
Array.prototype.forEach.call(codeBlocksWithPaths, function (code) {
  var codePath = path.join(__dirname, '..', code.dataset.path)
  var extension = path.extname(codePath)
  code.classList.add('language-' + extension.substring(1))
  code.textContent = fs.readFileSync(codePath)
})

document.addEventListener('DOMContentLoaded', function () {
  var highlight = require('highlight.js')
  var codeBlocks = document.querySelectorAll('pre code')
  Array.prototype.forEach.call(codeBlocks, function (code) {
    highlight.highlightBlock(code)
  })
})
