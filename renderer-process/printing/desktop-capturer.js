const electron = require('electron')
const desktopCapturer = electron.desktopCapturer
const electronScreen = electron.screen
const shell = electron.shell

const fs = require('fs')
const os = require('os')
const path = require('path')

const screenshot = document.getElementById('screen-shot')

screenshot.addEventListener('click', function (event) {
  const thumbSize = determineScreenShotSize()
  desktopCapturer.getSources({types: ['screen'], thumbnailSize: thumbSize}, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === "Entire screen") {
        var screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

        fs.writeFile(screenshotPath, source.thumbnail.toPng(), function (error) {
          if (error) return console.log(error)
          shell.openItem(screenshotPath)
        })
      }
    })
  })
})

function determineScreenShotSize () {
  var screenSize = electronScreen.getPrimaryDisplay().workAreaSize
  var maxDimension = Math.max(screenSize.width, screenSize.height)
  return {
    width: maxDimension * window.devicePixelRatio,
    height: maxDimension * window.devicePixelRatio
  }
}
