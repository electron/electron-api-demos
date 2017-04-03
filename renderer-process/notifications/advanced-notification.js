/* global Notification */

var path = require('path')

const notification =
  {
    title: 'Notification with image',
    body: 'Short message plus a custom image',
    icon: path.join(__dirname, '/../../assets/img/programming.png')
  }
const notificationButton = document.getElementById('advanced-noti')

notificationButton.addEventListener('click', function () {
  let myNotification = new Notification(notification.title, notification)

  myNotification.onclick = () => {
    console.log('Notification clicked')
  }
})
