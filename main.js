var app = require('app');
var BrowserWindow = require('browser-window');
var glob = require('glob');

var mainWindow = null;

// Require and setup each JS file in the main-process dir
glob('main-process/**/*.js', function (error, files) {
  files.forEach(function (file) {
    require('./' + file).setup();
  });
});

function createWindow () {
  mainWindow = new BrowserWindow({ width: 920, 'min-width': 680, height: 900 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
