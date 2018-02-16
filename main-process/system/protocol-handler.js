const {app, dialog} = require('electron')

app.setAsDefaultProtocolClient('electron-api-demos')

app.on('open-url', (event, url) => {
  dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})
