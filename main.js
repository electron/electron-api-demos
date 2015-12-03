var app = require('app');
var BrowserWindow = require('browser-window');

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
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
