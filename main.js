var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

var openFileDialog = require('./main-process/native-ui/dialogs/open-file.js');
openFileDialog();

var errorDialog = require('./main-process/native-ui/dialogs/error.js');
errorDialog();

var infoDialog = require('./main-process/native-ui/dialogs/information.js');
infoDialog();

var saveDialog = require('./main-process/native-ui/dialogs/save.js');
saveDialog();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 900 });

  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});
