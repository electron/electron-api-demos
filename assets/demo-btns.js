const storage = require('electron-json-storage')

const demoBtns = document.querySelectorAll('.js-container-target')
// Listen for demo button clicks
Array.prototype.forEach.call(demoBtns, function (btn) {
  btn.addEventListener('click', function (event) {
    event.target.parentElement.classList.toggle('is-open')

    // Save currently active demo button in localStorage
    storage.set('activeDemoButtonId', event.target.getAttribute('id'), function (err) {
      if (err) return console.error(err)
    })
  })
})

// Default to the demo that was active the last time the app was open
storage.get('activeDemoButtonId', function (err, id) {
  if (err) return console.error(err)
  if (id && id.length) document.getElementById(id).click()
})
