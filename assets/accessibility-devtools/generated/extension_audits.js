if (!axs) var axs = {}; if (!goog) var goog = {}; axs.ExtensionAuditRule = function(a) {
  goog.object.extend(a, this);
  return a;
};
axs.ExtensionAuditRule.prototype.addElement = function(a, b) {
  a.push(axs.content.convertNodeToResult(b));
};
axs.ExtensionAuditRule.prototype.runInDevtools = function(a, b) {
  var c = chrome.runtime.id + "-" + this.name;
  a = a || {};
  var d = "(" + function(a, b, c, d) {
    window.relevantNodes = [];
    window.failingNodes = [];
    document.addEventListener(a, function(a) {
      d && window.relevantNodes && window.relevantNodes.length >= d ? window.resultsTruncated = !0 : (a = a.target, window.relevantNodes.push(a), b(a) && c(window.failingNodes, a));
    }, !1);
  } + ')("' + c + '", ' + this.test_ + ", " + this.addElement + ", " + ("maxResults" in a ? a.maxResults : null) + ")", e = a.contentScriptInjected;
  chrome.devtools.inspectedWindow.eval(d, {useContentScriptContext:e});
  chrome.devtools.inspectedWindow.eval("(function() { var axs = {};\naxs.utils = {};\naxs.utils.parentElement = " + axs.utils.parentElement + ";\naxs.utils.isElementHidden = " + axs.utils.isElementHidden + ";\naxs.utils.isElementOrAncestorHidden = " + axs.utils.isElementOrAncestorHidden + ";\naxs.utils.isElementImplicitlyFocusable = " + axs.utils.isElementImplicitlyFocusable + ";\naxs.AuditRule = {};\naxs.AuditRule.collectMatchingElements = " + axs.AuditRule.collectMatchingElements + ";\nvar relevantElementMatcher = " + 
  this.relevantElementMatcher_ + ";\nvar sendRelevantNodesToContentScript = " + function(a, b) {
    var c = [];
    axs.AuditRule.collectMatchingElements(document, a, c);
    for (var d = 0;d < c.length;d++) {
      var e = c[d], l = document.createEvent("Event");
      l.initEvent(b, !0, !1);
      e.dispatchEvent(l);
    }
  } + ';\nsendRelevantNodesToContentScript(relevantElementMatcher, "' + c + '"); })()');
  chrome.devtools.inspectedWindow.eval("(" + function() {
    var a = axs.constants.AuditResult.NA;
    window.relevantNodes.length && (a = window.failingNodes.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS);
    window.relevantNodes.length = 0;
    var b = window.failingNodes.slice(0);
    window.failingNodes.length = 0;
    a = {result:a, elements:b};
    window.truncatedResults && (a.truncatedResults = !0);
    delete window.truncatedResults;
    return a;
  } + ")()", {useContentScriptContext:e}, b);
};
axs.ExtensionAuditRules = {};
axs.ExtensionAuditRules.getRule = function(a) {
  if (!axs.ExtensionAuditRules.rules) {
    axs.ExtensionAuditRules.rules = {};
    for (var b = axs.AuditRules.getRules(), c = 0;c < b.length;c++) {
      var d = new axs.ExtensionAuditRule(b[c]);
      axs.ExtensionAuditRules.rules[d.name] = d;
    }
  }
  return axs.ExtensionAuditRules.rules[a];
};

