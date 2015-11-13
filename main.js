var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');

var mainWindow = null;

var openFileDialog = require('./main-process/dialogs/open-file.js')
openFileDialog()

var errorDialog = require('./main-process/dialogs/error.js')
errorDialog()

app.on('window-all-closed', () => {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 900 });

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
