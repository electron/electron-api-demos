const {BrowserWindow} = require('electron').remote
const path = require('path')

const manageWindowBtn = document.getElementById('manage-window')
let win

manageWindowBtn.addEventListener('click', (event) => {
  const modalPath = path.join('file://', __dirname, '../../sections/windows/manage-modal.html')
  win = new BrowserWindow({ width: 400, height: 275 })

  win.on('resize', updateReply)
  win.on('move', updateReply)
  win.on('close', () => { win = null })
  win.loadURL(modalPath)
  win.show()

  function updateReply () {
    const manageWindowReply = document.getElementById('manage-window-reply')
    const message = `Size: ${win.getSize()} Position: ${win.getPosition()}`
    manageWindowReply.innerText = message
  }
})
