const {BrowserWindow, dialog} = require('electron').remote
const path = require('path')

const processCrashBtn = document.getElementById('process-crash')

processCrashBtn.addEventListener('click', (event) => {
  const crashWinPath = path.join('file://', __dirname, '../../sections/windows/process-crash.html')
  let win = new BrowserWindow({
    width: 400,
    height: 320,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.webContents.on('crashed', () => {
    const options = {
      type: 'info',
      title: 'Renderer Process Crashed',
      message: 'This process has crashed.',
      buttons: ['Reload', 'Close']
    }

    dialog.showMessageBox(options, (index) => {
      if (index === 0) win.reload()
      else win.close()
    })
  })

  win.on('close', () => { win = null })
  win.loadURL(crashWinPath)
  win.show()
})
