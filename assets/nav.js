// Listen for nav clicks
document.body.addEventListener('click', function (event) {
  if (classContains(event, 'nav-link') || classContains(event, 'nav-footer-link')) {
    var viewId = '#' + event.target.dataset.view + '-view';
    removeSelectedShow();
    event.target.classList.add('is-selected');
    document.querySelector(viewId).classList.add('show');
  }
});

function classContains (event, className) {
  return event.target.classList.contains(className)
}

function removeSelectedShow () {
  if (document.querySelector('.is-selected')) {
    document.querySelector('.is-selected').classList.remove('is-selected');
  }
  document.querySelector('.show').classList.remove('show');
}
