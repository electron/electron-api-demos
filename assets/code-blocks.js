const fs = require('fs')
const path = require('path')

const codeBlocksWithPaths = document.querySelectorAll('code[data-path]')

Array.prototype.forEach.call(codeBlocksWithPaths, function (code) {
  let codePath = path.join(__dirname, '..', code.dataset.path)
  let extension = path.extname(codePath)
  code.classList.add('language-' + extension.substring(1))
  code.textContent = fs.readFileSync(codePath)
})

document.addEventListener('DOMContentLoaded', function () {
  let highlight = require('highlight.js')
  let codeBlocks = document.querySelectorAll('pre code')
  Array.prototype.forEach.call(codeBlocks, function (code) {
    highlight.highlightBlock(code)
  })
})
