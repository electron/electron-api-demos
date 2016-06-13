const shell = require('electron').shell

const path = require('path')

const protocolHandlerBtn = document.getElementById('protocol-handler')

protocolHandlerBtn.addEventListener('click', function () {
  const appDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', appDirectory, '../../sections/system/protocol-link.html')
  shell.openExternal(pagePath)
})
