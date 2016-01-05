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
