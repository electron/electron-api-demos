var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('electron').ipcMain;

var mainWindow = null;

var openFileDialog = require('./main-process/dialogs/open-file.js');
openFileDialog();

var errorDialog = require('./main-process/dialogs/error.js');
errorDialog();

var infoDialog = require('./main-process/dialogs/information.js');
infoDialog();

var saveDialog = require('./main-process/dialogs/save.js');
saveDialog();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 733 });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  ipc.on('eval', function (event, code) {
    event.returnValue = eval('(' + code + ')')();
  });

  // mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
