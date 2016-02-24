var electron = require('electron');
var Menu = electron.Menu;
var Tray = electron.Tray;
var ipc = electron.ipcMain;
var path = require('path');

var appIcon = null;

module.exports.setup = function () {
  ipc.on('put-in-tray', function (event) {
    var iconPath = path.join(process.cwd(), 'main-process/native-ui/tray/iconTemplate.png');
    appIcon = new Tray(iconPath);
    var contextMenu = Menu.buildFromTemplate([
      { label: 'Remove',
        click: function (menuItem, browserWindow) {
          event.sender.send('tray-removed');
          appIcon.destroy();
        }
      }
    ]);
    appIcon.setToolTip('Electron Demo in the tray.');
    appIcon.setContextMenu(contextMenu);
  });

  ipc.on('remove-tray', function (event) {
    appIcon.destroy();
  });
};
