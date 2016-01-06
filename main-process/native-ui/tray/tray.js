var electron = require('electron');
var Menu = electron.Menu;
var Tray = electron.Tray;
var ipc = electron.ipcMain;
var path = require('path');

var appIcon = null;

module.exports.setup = function () {
  ipc.on('put-in-tray', function (event) {
    var iconPath = path.join(process.cwd(), 'main-process/native-ui/tray/IconTemplate.png')
    appIcon = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([
      { label: 'Hello', type: 'radio' },
    ]);
    appIcon.setToolTip('Electron Demo in the tray.');
    appIcon.setContextMenu(contextMenu);
    // No reason to keep it around for the whole demo
    // so remove icon after 1 minute.
    // TODO create an icon
    setTimeout(function () { appIcon.destroy(); }, 60000)
  })
}
