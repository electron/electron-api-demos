var demoBtns = document.querySelectorAll('.js-container-target');
Array.prototype.forEach.call(demoBtns, function (btn) {
  btn.addEventListener('click', function (event) {
    if (event.target.parentElement.classList.contains('active')) {
      event.target.parentElement.classList.remove('active');
    } else {
      event.target.parentElement.classList.add('active');
    }
  });
});
