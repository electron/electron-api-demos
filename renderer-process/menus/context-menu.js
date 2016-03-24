var remote = require('electron').remote
var Menu = remote.Menu
var MenuItem = remote.MenuItem

var menu = new Menu()

menu.append(new MenuItem({ label: 'Hello' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Electron', type: 'checkbox', checked: true }))

// Show when window is right-clicked
window.addEventListener('contextmenu', function (e) {
  e.preventDefault()
  menu.popup(remote.getCurrentWindow())
}, false)

// Show when demo button is clicked
var contextMenuBtn = document.getElementById('context-menu')
contextMenuBtn.addEventListener('click', function () {
  menu.popup(remote.getCurrentWindow())
})
