const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')

const manageWindowBtn = document.getElementById('manage-window')
const focusModalBtn = document.getElementById('focus-on-modal-window')
let win

manageWindowBtn.addEventListener('click', function (event) {
  const modalPath = path.join('file://', __dirname, '../../sections/windows/manage-modal.html')
  win = new BrowserWindow({ width: 400, height: 275 })
  win.on('resize', updateReply)
  win.on('move', updateReply)
  win.on('close', function () { 
    focusModalBtn.classList.add('no-display')
    win = null 
  })
  win.loadURL(modalPath)
  win.show()
  showFocusBtn()
  function updateReply () {
    const manageWindowReply = document.getElementById('manage-window-reply')
    const message = `Size: ${win.getSize()} Position: ${win.getPosition()}`

    manageWindowReply.innerText = message
  } 
  function showFocusBtn () {
    focusModalBtn.classList.remove('no-display')
  }
})

focusModalBtn.addEventListener('click', function (event) {
   win.focus()
})


