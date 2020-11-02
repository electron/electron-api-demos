// this is deprecated since M80 https://www.chromestatus.com/features/5144752345317376
// const links = document.querySelectorAll('link[rel="import"]')

// // Import and add each page to the DOM
// Array.prototype.forEach.call(links, (link) => {
//   let template = link.import.querySelector('.task-template')
//   let clone = document.importNode(template.content, true)
//   if (link.href.match('about.html')) {
//     document.querySelector('body').appendChild(clone)
//   } else {
//     document.querySelector('.content').appendChild(clone)
//     console.log(clone)
//   }
// })

// GET can be synchronous, which we want
// source: https://www.w3schools.com/howto/howto_html_include.asp
// JSDOM would achieve same result with nicer code but more overhead: https://www.twilio.com/blog/web-scraping-and-parsing-html-in-node-js-with-jsdom
function includeHTML() {
  var links, i, elmnt, href, request;
  /* Loop through a collection of all HTML elements: */
  links = document.querySelectorAll('link[rel="import"]');
  // console.log(links)
  for (i = 0; i < links.length; i++) {
    elmnt = links[i];
    /*search for elements with a certain atrribute:*/
    href = elmnt.getAttribute('href');
    // console.log(href)
    if (href) {
      /* Make an HTTP request using the attribute value as the file name: */
      request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          // console.log(elmnt)                // <link ref="import" href="sections/windows/crash-hang.html">
          let template = elmnt.querySelector('.task-template')
          let clone = document.importNode(template.content, true)
          if (href.match('about.html')) {
            document.querySelector('body').appendChild(clone)
          } else {
            document.querySelector('.content').appendChild(clone)
          }
          elmnt.remove(); 
          includeHTML();
        }
      }
      request.open("GET", href, false);     // `false` makes the request synchronous
      request.send();
      /* Exit the function: */
      return;
    }
  }
}
includeHTML();
