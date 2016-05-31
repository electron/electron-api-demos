const ChildProcess = require('child_process')
const path = require('path')

const version = require('../package').version

const command = path.join(__dirname, '..', 'node_modules', '.bin', 'electron-windows-store.cmd')
const args = [
  '--input-directory',
  path.join(__dirname, '..', 'out', 'ElectronAPIDemos-win32-ia32'),
  '--output-directory',
  path.join(__dirname, '..', 'windows-store'),
  '--flatten',
  true,
  '--package-version',
  version,
  '--package-name',
  'ElectronAPIDemos'
]

const windowsStore = ChildProcess.spawn(command, args, {stdio: 'inherit'})
windowsStore.on('close', (code) => {
  process.exit(code)
})
