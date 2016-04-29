let normalize = require('electron-shortcut-normalizer')
let shortcuts = document.querySelectorAll('kbd.normalize-to-platform')

Array.prototype.forEach.call(shortcuts, function (shortcut) {
  shortcut.innerText = normalize(shortcut.innerText, process.platform)
})
