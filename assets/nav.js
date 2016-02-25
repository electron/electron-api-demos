// Listen for nav clicks

document.body.addEventListener('click', function (event) {
  if (event.target.classList.contains('nav-link')) {
    var viewId = '#' + event.target.dataset.view + '-view';
    removeSelectedShow();
    event.target.classList.add('is-selected');
    document.querySelector(viewId).classList.add('show');
  }
});

function removeSelectedShow () {
  document.querySelector('.is-selected').classList.remove('is-selected');
  document.querySelector('.show').classList.remove('show');
}
