const os = require('os')
const homeDir = os.homedir()

const sysInfoBtn = document.getElementById('sys-info')

sysInfoBtn.addEventListener('click', function () {
  const message = `Your system home directory is: ${homeDir}`
  document.getElementById('got-sys-info').innerHTML = message
})
