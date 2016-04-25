const shell = require('electron').shell

const path = require('path')

const protocolHandlerBtn = document.getElementById('protocol-handler')

protocolHandlerBtn.addEventListener('click', function () {
  const pagePath = path.join('file://', __dirname, '../../sections/system/protocol-link.html')
  shell.openExternal(pagePath)
})
