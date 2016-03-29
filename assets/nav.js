const storage = require('electron-json-storage')

document.body.addEventListener('click', function (event) {
  // Ignore clicks that don't have a target view
  if (!event.target.dataset.view) return

  // Hide currently active button and view
  removeClass('is-selected')
  removeClass('show')

  // Highlight clicked button and show view
  event.target.classList.add('is-selected')
  const viewId = event.target.dataset.view + '-view'
  document.getElementById(viewId).classList.add('show')

  // Save currently active button in localStorage
  storage.set('buttonId', event.target.getAttribute('id'))
})

// Default to the view that was active the last time the app was open
storage.get('buttonId', function (err, buttonId) {
  if (err) return console.error(err)
  if (buttonId && buttonId.length) {
    document.getElementById(buttonId).click()
  }
})

function removeClass (className) {
  let el = document.querySelector('.' + className)
  if (el) el.classList.remove(className)
}
