/* global Notification */

const notification =
  {
    title: 'Basic Notification',
    body: 'Short message part'
  }
const notificationButton = document.getElementById('basic-noti')

notificationButton.addEventListener('click', function () {
  let myNotification = new Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
})
