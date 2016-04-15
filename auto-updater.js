const app = require('electron').app
const autoUpdater = require('electron').autoUpdater
const Menu = require('electron').Menu

var state = 'checking'

exports.initialize = function () {
  autoUpdater.on('checking-for-update', function () {
    state = 'checking'
    exports.updateMenu()
  })

  autoUpdater.on('update-available', function () {
    state = 'checking'
    exports.updateMenu()
  })

  autoUpdater.on('update-downloaded', function () {
    state = 'installed'
    exports.updateMenu()
  })

  autoUpdater.on('update-not-available', function () {
    state = 'no-update'
    exports.updateMenu()
  })

  autoUpdater.on('error', function () {
    state = 'no-update'
    exports.updateMenu()
  })

  autoUpdater.setFeedURL(`https://electron-api-demos.githubapp.com/updates?version=${app.getVersion()}`)
  autoUpdater.checkForUpdates()
}

exports.updateMenu = function () {
  var menu = Menu.getApplicationMenu()
  if (!menu) return

  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        switch (item.key) {
          case 'checkForUpdate':
            item.visible = state === 'no-update'
            break
          case 'checkingForUpdate':
            item.visible = state === 'checking'
            break
          case 'restartToUpdate':
            item.visible = state === 'installed'
            break
        }
      })
    }
  })
}
