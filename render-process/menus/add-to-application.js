var remote = require('electron').remote;
var Menu = remote.Menu;
var MenuItem = remote.MenuItem;

var demoItem = new MenuItem({ label: 'Menu Demo' });
var menu = window.menu
console.log('menu', menu)
menu.append(demoItem)

Menu.setApplicationMenu(menu);
