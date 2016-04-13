if (!axs) var axs = {}; if (!goog) var goog = {}; axs.content = {};
axs.content.auditResultNodes || (axs.content.auditResultNodes = {});
axs.content.sidebarNodes || (axs.content.sidebarNodes = {});
axs.content.lastNodeId || (axs.content.lastNodeId = 0);
axs.content.convertNodeToResult = function(a) {
  var b = "" + axs.content.lastNodeId++;
  axs.content.auditResultNodes[b] = a;
  return b;
};
axs.content.getResultNode = function(a) {
  var b = axs.content.auditResultNodes[a];
  delete axs.content.auditResultNodes[a];
  return b;
};
axs.content.convertNodeToSidebar = function(a) {
  var b = "" + axs.content.lastNodeId++;
  axs.content.sidebarNodes[b] = a;
  return b;
};
axs.content.getSidebarNode = function(a) {
  var b = axs.content.sidebarNodes[a];
  delete axs.content.sidebarNodes[a];
  return b;
};
axs.content.removeFragment = function(a) {
  var b = document.createElement("a");
  b.href = a;
  return b.protocol + "//" + b.host + b.pathname + b.search;
};
axs.content.frameURIs || (axs.content.frameURIs = {}, axs.content.frameURIs[axs.content.removeFragment(document.documentURI)] = !0);
window.addEventListener("message", function(a) {
  if ("object" == typeof a.data && "request" in a.data) {
    switch(a.data.request) {
      case "getUri":
        a.source.postMessage({request:"postUri", uri:axs.content.removeFragment(document.documentURI)}, "*");
        break;
      case "postUri":
        window.parent != window ? window.parent.postMessage(a.data, "*") : (a = a.data.uri, axs.content.frameURIs[a] = !0);
        break;
      case "deleteUri":
        window.parent != window ? window.parent.postMessage(a.data, "*") : (a = a.data.uri, delete axs.content.frameURIs[a]);
    }
  }
}, !1);
window.addEventListener("beforeunload", function(a) {
  window.parent != window && window.parent.postMessage({request:"deleteUri", uri:axs.content.removeFragment(document.documentURI)}, "*");
}, !1);
(function() {
  for (var a = window.frames, b = 0;b < a.length;b++) {
    var c = a[b], d = axs.content.removeFragment(document.documentURI);
    try {
      c.postMessage({request:"getUri"}, "*");
    } catch (e) {
      console.warn("got exception when trying to postMessage from " + d + " to frame", c, e);
    }
  }
})();
axs.extensionProperties = {};
axs.extensionProperties.getAllProperties = function(a) {
  function b(a) {
    for (var d in a) {
      var e = a[d];
      if ("object" == typeof e) {
        if (e instanceof Node) {
          var f = axs.utils.getQuerySelectorText(e);
          if (!(0 > f.indexOf(" "))) {
            var f = e.tagName.toLowerCase(), g = e.className;
            g && (f += "." + g);
          }
          a[d] = {node:axs.content.convertNodeToSidebar(e), text:f};
        } else {
          a[d] = b(a[d]);
        }
      }
    }
    return a;
  }
  a = axs.properties.getAllProperties(a);
  return b(a);
};

