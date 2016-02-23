// Add listeners for each section
document.querySelector('.to-windows').addEventListener('click', function () {
  // console.log("clicked to windows")
  removeSelectedShow()
  document.querySelector('.to-windows').classList.add('is-selected')
  document.querySelector('#windows-view').classList.add('show')
})

document.querySelector('.to-menus').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-menus').classList.add('is-selected')
  document.querySelector('#menus-view').classList.add('show')
})

document.querySelector('.to-ex-links-file-manager').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-ex-links-file-manager').classList.add('is-selected')
  document.querySelector('#ex-links-file-manager-view').classList.add('show')
})

document.querySelector('.to-dialogs').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-dialogs').classList.add('is-selected')
  document.querySelector('#dialogs-view').classList.add('show')
})

document.querySelector('.to-tray').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-tray').classList.add('is-selected')
  document.querySelector('#tray-view').classList.add('show')
})

document.querySelector('.to-ipc').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-ipc').classList.add('is-selected')
  document.querySelector('#ipc-view').classList.add('show')
})

document.querySelector('.to-app-sys-information').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-app-sys-information').classList.add('is-selected')
  document.querySelector('#app-sys-information-view').classList.add('show')
})

document.querySelector('.to-clipboard').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-clipboard').classList.add('is-selected')
  document.querySelector('#clipboard-view').classList.add('show')
})

document.querySelector('.to-pdf').addEventListener('click', function () {
  // console.log("clicked to menus")
  removeSelectedShow()
  document.querySelector('.to-pdf').classList.add('is-selected')
  document.querySelector('#pdf-view').classList.add('show')
})

// Remove classes for currently selected item
function removeSelectedShow () {
  document.querySelector('.is-selected').classList.remove('is-selected')
  document.querySelector('.show').classList.remove('show')
}
