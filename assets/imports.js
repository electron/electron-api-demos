var links = document.querySelectorAll('link[rel="import"]');
var array = [];
// Import and add each page to the DOM
array.forEach.call(links, function (link) {
  var template = link.import.querySelector('.task-template');
  var clone = document.importNode(template.content, true);
  document.querySelector('.content').appendChild(clone);
});
