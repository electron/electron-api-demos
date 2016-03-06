var app = require('electron').app;
var BrowserWindow = require('electron').BrowserWindow;

var glob = require('glob');

var mainWindow = null;

// Require and setup each JS file in the main-process dir
glob(__dirname + '/main-process/**/*.js', function (error, files) {
  if (error) return console.log(error);
  files.forEach(function (file) {
    require(file).setup();
  });
});

function createWindow () {
  mainWindow = new BrowserWindow({ width: 920, 'min-width': 680, height: 900 });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on('closed', function () {
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
