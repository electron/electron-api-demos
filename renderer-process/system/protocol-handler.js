const {shell} = require('electron')
const path = require('path')

const protocolHandlerBtn = document.getElementById('protocol-handler')

protocolHandlerBtn.addEventListener('click', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked')
  const pagePath = path.join('file://', pageDirectory, '../../sections/system/protocol-link.html')
  shell.openExternal(pagePath)
})
