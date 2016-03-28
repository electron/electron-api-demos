var demoBtns = document.querySelectorAll('.js-container-target')
// Listen for demo button clicks
Array.prototype.forEach.call(demoBtns, function (btn) {
  btn.addEventListener('click', function (event) {
    event.target.parentElement.classList.toggle('active')
  })
})
