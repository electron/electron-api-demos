var storage = require('electron-json-storage')

// Default to the view that was active the last time the app was open
storage.get('activeSectionButtonId', function (err, id) {
  if (err) return console.error(err)

  if (id && id.length) {
    showMainContent()
    document.getElementById(id).click()
  } else {
    activateDefaultSection()
    displayAbout()
  }
})

document.body.addEventListener('click', function (event) {
  if (event.target.dataset.section) {
    handleSectionTrigger(event)
  } else if (event.target.dataset.modal) {
    handleModalTrigger(event)
  } else if (event.target.classList.contains('modal-hide')) {
    hideAllModals()
  }
})

function handleSectionTrigger (event) {
  hideAllSectionsAndDeselectButtons()

  // Highlight clicked button and show view
  event.target.classList.add('is-selected')

  // Display the current section
  let sectionId = event.target.dataset.section + '-section'
  document.getElementById(sectionId).classList.add('is-shown')

  // Save currently active button in localStorage
  let buttonId = event.target.getAttribute('id')
  storage.set('activeSectionButtonId', buttonId, function (err) {
    if (err) return console.error(err)
  })
}

function activateDefaultSection () {
  document.getElementById('button-windows').click()
}

function showMainContent () {
  document.querySelector('.js-nav').classList.add('is-shown')
  document.querySelector('.js-content').classList.add('is-shown')
}

function handleModalTrigger (event) {
  hideAllModals()
  let modalId = event.target.dataset.modal + '-modal'
  console.log('modalId', modalId)
  document.getElementById(modalId).classList.add('is-shown')
}

function hideAllModals () {
  let modals = document.querySelectorAll('.modal.is-shown')
  Array.prototype.forEach.call(modals, function (modal) {
    modal.classList.remove('is-shown')
  })
  showMainContent()
}

function hideAllSectionsAndDeselectButtons () {
  let sections = document.querySelectorAll('.js-section.is-shown')
  Array.prototype.forEach.call(sections, function (section) {
    section.classList.remove('is-shown')
  })

  let buttons = document.querySelectorAll('.nav-button.is-selected')
  Array.prototype.forEach.call(buttons, function (button) {
    button.classList.remove('is-selected')
  })
}

function displayAbout () {
  document.querySelector('#about-modal').classList.add('is-shown')
}
