var links = document.querySelectorAll('link[rel="import"]');
// Import and add each page to the DOM
Array.prototype.forEach.call(links, function (link) {
  var template = link.import.querySelector('.task-template');
  var clone = document.importNode(template.content, true);
  document.querySelector('.content').appendChild(clone);
});
