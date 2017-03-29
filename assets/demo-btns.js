const settings = require('electron-settings')

const demoBtns = document.querySelectorAll('.js-container-target')
// Listen for demo button clicks
Array.prototype.forEach.call(demoBtns, function (btn) {
  btn.addEventListener('click', function (event) {
    const parent = event.target.parentElement

    // Toggles the "is-open" class on the demo's parent element.
    parent.classList.toggle('is-open')

    // Saves the active demo if it is open, or clears it if the demo was user
    // collapsed by the user
    if (parent.classList.contains('is-open')) {
      settings.set('activeDemoButtonId', event.target.getAttribute('id'))
    } else {
      settings.delete('activeDemoButtonId')
    }
  })
})

// Default to the demo that was active the last time the app was open
const buttonId = settings.get('activeDemoButtonId')
if (buttonId) {
  document.getElementById(buttonId).click()
}
