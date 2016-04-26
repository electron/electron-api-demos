<html>
  <script type="text/javascript">
    const ipc = require('electron').ipcRenderer
    const BrowserWindow = require('electron').remote.BrowserWindow

    ipc.on('compute-factorial', function (event, number, fromWindowId) {
      const result = factorial(number)
      const fromWindow = BrowserWindow.fromId(fromWindowId)
      fromWindow.webContents.send('factorial-computed', number, result)
      window.close()
    })

    function factorial (num) {
      if (num === 0) return 1
      return num * factorial(num - 1)
    }
  </script>
</html>
