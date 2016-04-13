if (!axs) var axs = {}; if (!goog) var goog = {}; axs.AuditResults = function() {
  this.errors_ = [];
  this.warnings_ = [];
};
goog.exportSymbol("axs.AuditResults", axs.AuditResults);
axs.AuditResults.prototype.addError = function(a) {
  "" != a && this.errors_.push(a);
};
goog.exportProperty(axs.AuditResults.prototype, "addError", axs.AuditResults.prototype.addError);
axs.AuditResults.prototype.addWarning = function(a) {
  "" != a && this.warnings_.push(a);
};
goog.exportProperty(axs.AuditResults.prototype, "addWarning", axs.AuditResults.prototype.addWarning);
axs.AuditResults.prototype.numErrors = function() {
  return this.errors_.length;
};
goog.exportProperty(axs.AuditResults.prototype, "numErrors", axs.AuditResults.prototype.numErrors);
axs.AuditResults.prototype.numWarnings = function() {
  return this.warnings_.length;
};
goog.exportProperty(axs.AuditResults.prototype, "numWarnings", axs.AuditResults.prototype.numWarnings);
axs.AuditResults.prototype.getErrors = function() {
  return this.errors_;
};
goog.exportProperty(axs.AuditResults.prototype, "getErrors", axs.AuditResults.prototype.getErrors);
axs.AuditResults.prototype.getWarnings = function() {
  return this.warnings_;
};
goog.exportProperty(axs.AuditResults.prototype, "getWarnings", axs.AuditResults.prototype.getWarnings);
axs.AuditResults.prototype.toString = function() {
  for (var a = "", b = 0;b < this.errors_.length;b++) {
    0 == b && (a += "\nErrors:\n");
    var c = this.errors_[b], a = a + (c + "\n\n");
  }
  for (b = 0;b < this.warnings_.length;b++) {
    0 == b && (a += "\nWarnings:\n"), c = this.warnings_[b], a += c + "\n\n";
  }
  return a;
};
goog.exportProperty(axs.AuditResults.prototype, "toString", axs.AuditResults.prototype.toString);
axs.AuditRule = function(a) {
  for (var b = !0, c = [], d = 0;d < axs.AuditRule.requiredFields.length;d++) {
    var e = axs.AuditRule.requiredFields[d];
    e in a || (b = !1, c.push(e));
  }
  if (!b) {
    throw "Invalid spec; the following fields were not specified: " + c.join(", ") + "\n" + JSON.stringify(a);
  }
  this.name = a.name;
  this.severity = a.severity;
  this.relevantElementMatcher_ = a.relevantElementMatcher;
  this.test_ = a.test;
  this.code = a.code;
  this.heading = a.heading || "";
  this.url = a.url || "";
  this.requiresConsoleAPI = !!a.opt_requiresConsoleAPI;
};
axs.AuditRule.requiredFields = "name severity relevantElementMatcher test code heading".split(" ");
axs.AuditRule.NOT_APPLICABLE = {result:axs.constants.AuditResult.NA};
axs.AuditRule.prototype.addElement = function(a, b) {
  a.push(b);
};
axs.AuditRule.collectMatchingElements = function(a, b, c, d) {
  if (a.nodeType == Node.ELEMENT_NODE) {
    var e = a
  }
  e && b.call(null, e) && c.push(e);
  if (e) {
    var f = e.shadowRoot || e.webkitShadowRoot;
    if (f) {
      axs.AuditRule.collectMatchingElements(f, b, c, f);
      return;
    }
  }
  if (e && "content" == e.localName) {
    for (e = e.getDistributedNodes(), f = 0;f < e.length;f++) {
      axs.AuditRule.collectMatchingElements(e[f], b, c, d);
    }
  } else {
    if (e && "shadow" == e.localName) {
      if (f = e, d) {
        for (e = f.getDistributedNodes(), f = 0;f < e.length;f++) {
          axs.AuditRule.collectMatchingElements(e[f], b, c, d);
        }
      } else {
        console.warn("ShadowRoot not provided for", e);
      }
    }
    for (a = a.firstChild;null != a;) {
      axs.AuditRule.collectMatchingElements(a, b, c, d), a = a.nextSibling;
    }
  }
};
axs.AuditRule.prototype.run = function(a) {
  a = a || {};
  var b = "ignoreSelectors" in a ? a.ignoreSelectors : [], c = "maxResults" in a ? a.maxResults : null, d = [];
  axs.AuditRule.collectMatchingElements("scope" in a ? a.scope : document, this.relevantElementMatcher_, d);
  var e = [];
  if (!d.length) {
    return {result:axs.constants.AuditResult.NA};
  }
  for (var f = 0;f < d.length && !(null != c && e.length >= c);f++) {
    var g = d[f], h;
    a: {
      h = g;
      for (var k = 0;k < b.length;k++) {
        if (axs.browserUtils.matchSelector(h, b[k])) {
          h = !0;
          break a;
        }
      }
      h = !1;
    }
    !h && this.test_(g, a.config) && this.addElement(e, g);
  }
  a = {result:e.length ? axs.constants.AuditResult.FAIL : axs.constants.AuditResult.PASS, elements:e};
  f < d.length && (a.resultsTruncated = !0);
  return a;
};
axs.AuditRules = {};
(function() {
  var a = {}, b = {};
  axs.AuditRules.specs = {};
  axs.AuditRules.addRule = function(c) {
    var d = new axs.AuditRule(c);
    if (d.code in b) {
      throw Error('Can not add audit rule with same code: "' + d.code + '"');
    }
    if (d.name in a) {
      throw Error('Can not add audit rule with same name: "' + d.name + '"');
    }
    a[d.name] = b[d.code] = d;
    axs.AuditRules.specs[c.name] = c;
  };
  axs.AuditRules.getRule = function(c) {
    return a[c] || b[c] || null;
  };
  axs.AuditRules.getRules = function(b) {
    var d = Object.keys(a);
    return b ? d : d.map(function(a) {
      return this.getRule(a);
    }, axs.AuditRules);
  };
})();
axs.Audit = {};
axs.AuditConfiguration = function(a) {
  null == a && (a = {});
  this.rules_ = {};
  this.maxResults = this.auditRulesToIgnore = this.auditRulesToRun = this.scope = null;
  this.withConsoleApi = !1;
  this.showUnsupportedRulesWarning = !0;
  for (var b in this) {
    this.hasOwnProperty(b) && b in a && (this[b] = a[b]);
  }
  goog.exportProperty(this, "scope", this.scope);
  goog.exportProperty(this, "auditRulesToRun", this.auditRulesToRun);
  goog.exportProperty(this, "auditRulesToIgnore", this.auditRulesToIgnore);
  goog.exportProperty(this, "withConsoleApi", this.withConsoleApi);
  goog.exportProperty(this, "showUnsupportedRulesWarning", this.showUnsupportedRulesWarning);
};
goog.exportSymbol("axs.AuditConfiguration", axs.AuditConfiguration);
axs.AuditConfiguration.prototype = {ignoreSelectors:function(a, b) {
  a in this.rules_ || (this.rules_[a] = {});
  "ignore" in this.rules_[a] || (this.rules_[a].ignore = []);
  Array.prototype.push.call(this.rules_[a].ignore, b);
}, getIgnoreSelectors:function(a) {
  return a in this.rules_ && "ignore" in this.rules_[a] ? this.rules_[a].ignore : [];
}, setSeverity:function(a, b) {
  a in this.rules_ || (this.rules_[a] = {});
  this.rules_[a].severity = b;
}, getSeverity:function(a) {
  return a in this.rules_ && "severity" in this.rules_[a] ? this.rules_[a].severity : null;
}, setRuleConfig:function(a, b) {
  a in this.rules_ || (this.rules_[a] = {});
  this.rules_[a].config = b;
}, getRuleConfig:function(a) {
  return a in this.rules_ && "config" in this.rules_[a] ? this.rules_[a].config : null;
}};
goog.exportProperty(axs.AuditConfiguration.prototype, "ignoreSelectors", axs.AuditConfiguration.prototype.ignoreSelectors);
goog.exportProperty(axs.AuditConfiguration.prototype, "getIgnoreSelectors", axs.AuditConfiguration.prototype.getIgnoreSelectors);
axs.Audit.unsupportedRulesWarningShown = !1;
axs.Audit.getRulesCannotRun = function(a) {
  return a.withConsoleApi ? [] : axs.AuditRules.getRules().filter(function(a) {
    return a.requiresConsoleAPI;
  }).map(function(a) {
    return a.code;
  });
};
axs.Audit.run = function(a) {
  a = a || new axs.AuditConfiguration;
  var b = a.withConsoleApi, c = [], d;
  d = a.auditRulesToRun && 0 < a.auditRulesToRun.length ? a.auditRulesToRun : axs.AuditRules.getRules(!0);
  if (a.auditRulesToIgnore) {
    for (var e = 0;e < a.auditRulesToIgnore.length;e++) {
      var f = a.auditRulesToIgnore[e];
      0 > d.indexOf(f) || d.splice(d.indexOf(f), 1);
    }
  }
  !axs.Audit.unsupportedRulesWarningShown && a.showUnsupportedRulesWarning && (e = axs.Audit.getRulesCannotRun(a), 0 < e.length && (console.warn("Some rules cannot be checked using the axs.Audit.run() method call. Use the Chrome plugin to check these rules: " + e.join(", ")), console.warn("To remove this message, pass an AuditConfiguration object to axs.Audit.run() and set configuration.showUnsupportedRulesWarning = false.")), axs.Audit.unsupportedRulesWarningShown = !0);
  for (e = 0;e < d.length;e++) {
    var f = d[e], g = axs.AuditRules.getRule(f);
    if (g && !g.disabled && (b || !g.requiresConsoleAPI)) {
      var h = {}, k = a.getIgnoreSelectors(g.name);
      if (0 < k.length || a.scope) {
        h.ignoreSelectors = k;
      }
      k = a.getRuleConfig(g.name);
      null != k && (h.config = k);
      a.scope && (h.scope = a.scope);
      a.maxResults && (h.maxResults = a.maxResults);
      h = g.run.call(g, h);
      g = axs.utils.namedValues(g);
      g.severity = a.getSeverity(f) || g.severity;
      h.rule = g;
      c.push(h);
    }
  }
  return c;
};
goog.exportSymbol("axs.Audit.run", axs.Audit.run);
axs.Audit.auditResults = function(a) {
  for (var b = new axs.AuditResults, c = 0;c < a.length;c++) {
    var d = a[c];
    d.result == axs.constants.AuditResult.FAIL && (d.rule.severity == axs.constants.Severity.SEVERE ? b.addError(axs.Audit.accessibilityErrorMessage(d)) : b.addWarning(axs.Audit.accessibilityErrorMessage(d)));
  }
  return b;
};
goog.exportSymbol("axs.Audit.auditResults", axs.Audit.auditResults);
axs.Audit.createReport = function(a, b) {
  var c;
  c = "*** Begin accessibility audit results ***\nAn accessibility audit found " + axs.Audit.auditResults(a).toString();
  b && (c += "\nFor more information, please see ", c += b);
  return c += "\n*** End accessibility audit results ***";
};
goog.exportSymbol("axs.Audit.createReport", axs.Audit.createReport);
axs.Audit.accessibilityErrorMessage = function(a) {
  for (var b = a.rule.severity == axs.constants.Severity.SEVERE ? "Error: " : "Warning: ", b = b + (a.rule.code + " (" + a.rule.heading + ") failed on the following " + (1 == a.elements.length ? "element" : "elements")), b = 1 == a.elements.length ? b + ":" : b + (" (1 - " + Math.min(5, a.elements.length) + " of " + a.elements.length + "):"), c = Math.min(a.elements.length, 5), d = 0;d < c;d++) {
    var e = a.elements[d], b = b + "\n";
    try {
      b += axs.utils.getQuerySelectorText(e);
    } catch (f) {
      b += " tagName:" + e.tagName, b += " id:" + e.id;
    }
  }
  "" != a.rule.url && (b += "\nSee " + a.rule.url + " for more information.");
  return b;
};
goog.exportSymbol("axs.Audit.accessibilityErrorMessage", axs.Audit.accessibilityErrorMessage);
axs.AuditRules.addRule({name:"ariaOnReservedElement", heading:"This element does not support ARIA roles, states and properties", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_12", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return !axs.properties.canTakeAriaAttributes(a);
}, test:function(a) {
  return null !== axs.properties.getAriaProperties(a);
}, code:"AX_ARIA_12"});
axs.AuditRules.addRule({name:"ariaOwnsDescendant", heading:"aria-owns should not be used if ownership is implicit in the DOM", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_06", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[aria-owns]");
}, test:function(a) {
  return axs.utils.getIdReferents("aria-owns", a).some(function(b) {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_CONTAINED_BY;
  });
}, code:"AX_ARIA_06"});
axs.AuditRules.addRule({name:"ariaRoleNotScoped", heading:"Elements with ARIA roles must be in the correct scope", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_09", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[role]");
}, test:function(a) {
  var b = axs.utils.getRoles(a);
  if (!b || !b.applied) {
    return !1;
  }
  b = b.applied.details.scope;
  if (!b || 0 === b.length) {
    return !1;
  }
  for (var c = a;c = c.parentNode;) {
    var d = axs.utils.getRoles(c, !0);
    if (d && d.applied && 0 <= b.indexOf(d.applied.name)) {
      return !1;
    }
  }
  if (a = axs.utils.getIdReferrers("aria-owns", a)) {
    for (c = 0;c < a.length;c++) {
      if ((d = axs.utils.getRoles(a[c], !0)) && d.applied && 0 <= b.indexOf(d.applied.name)) {
        return !1;
      }
    }
  }
  return !0;
}, code:"AX_ARIA_09"});
axs.AuditRules.addRule({name:"audioWithoutControls", heading:"Audio elements should have controls", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_audio_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "audio[autoplay]");
}, test:function(a) {
  return !a.querySelectorAll("[controls]").length && 3 < a.duration;
}, code:"AX_AUDIO_01"});
(function() {
  var a = /^aria\-/;
  axs.AuditRules.addRule({name:"badAriaAttribute", heading:"This element has an invalid ARIA attribute", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_11", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(b) {
    b = b.attributes;
    for (var c = 0, d = b.length;c < d;c++) {
      if (a.test(b[c].name)) {
        return !0;
      }
    }
    return !1;
  }, test:function(b) {
    b = b.attributes;
    for (var c = 0, d = b.length;c < d;c++) {
      var e = b[c].name;
      if (a.test(e) && (e = e.replace(a, ""), !axs.constants.ARIA_PROPERTIES.hasOwnProperty(e))) {
        return !0;
      }
    }
    return !1;
  }, code:"AX_ARIA_11"});
})();
axs.AuditRules.addRule({name:"badAriaAttributeValue", heading:"ARIA state and property values must be valid", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_04", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  var b = axs.utils.getSelectorForAriaProperties(axs.constants.ARIA_PROPERTIES);
  return axs.browserUtils.matchSelector(a, b);
}, test:function(a) {
  for (var b in axs.constants.ARIA_PROPERTIES) {
    var c = "aria-" + b;
    if (a.hasAttribute(c)) {
      var d = a.getAttribute(c);
      if (!axs.utils.getAriaPropertyValue(c, d, a).valid) {
        return !0;
      }
    }
  }
  return !1;
}, code:"AX_ARIA_04"});
axs.AuditRules.addRule({name:"badAriaRole", heading:"Elements with ARIA roles must use a valid, non-abstract ARIA role", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_01", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[role]");
}, test:function(a) {
  return !axs.utils.getRoles(a).valid;
}, code:"AX_ARIA_01"});
axs.AuditRules.addRule({name:"controlsWithoutLabel", heading:"Controls and media elements should have labels", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_text_01", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  if (!axs.browserUtils.matchSelector(a, 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), video:not([disabled])') || "presentation" == a.getAttribute("role")) {
    return !1;
  }
  if (0 <= a.tabIndex) {
    return !0;
  }
  for (a = axs.utils.parentElement(a);null != a;a = axs.utils.parentElement(a)) {
    if (axs.utils.elementIsAriaWidget(a)) {
      return !1;
    }
  }
  return !0;
}, test:function(a) {
  if (axs.utils.isElementOrAncestorHidden(a) || "input" == a.tagName.toLowerCase() && "button" == a.type && a.value.length || "button" == a.tagName.toLowerCase() && a.textContent.replace(/^\s+|\s+$/g, "").length || axs.utils.hasLabel(a)) {
    return !1;
  }
  a = axs.properties.findTextAlternatives(a, {});
  return null === a || "" === a.trim() ? !0 : !1;
}, code:"AX_TEXT_01", ruleName:"Controls and media elements should have labels"});
axs.AuditRules.addRule({name:"duplicateId", heading:"An element's ID must be unique in the DOM", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_html_02", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[id]");
}, test:function(a) {
  var b = a.id;
  if (!b) {
    return !1;
  }
  b = "[id='" + b.replace(/'/g, "\\'") + "']";
  return 1 < a.ownerDocument.querySelectorAll(b).length;
}, code:"AX_HTML_02"});
axs.AuditRules.addRule({name:"focusableElementNotVisibleAndNotAriaHidden", heading:"These elements are focusable but either invisible or obscured by another element", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  if (!axs.browserUtils.matchSelector(a, axs.utils.FOCUSABLE_ELEMENTS_SELECTOR)) {
    return !1;
  }
  if (0 <= a.tabIndex) {
    return !0;
  }
  for (var b = axs.utils.parentElement(a);null != b;b = axs.utils.parentElement(b)) {
    if (axs.utils.elementIsAriaWidget(b)) {
      return !1;
    }
  }
  a = axs.properties.findTextAlternatives(a, {});
  return null === a || "" === a.trim() ? !1 : !0;
}, test:function(a) {
  if (axs.utils.isElementOrAncestorHidden(a)) {
    return !1;
  }
  a.focus();
  return !axs.utils.elementIsVisible(a);
}, code:"AX_FOCUS_01"});
axs.AuditRules.addRule({name:"humanLangMissing", heading:"The web page should have the content's human language indicated in the markup", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_html_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return a instanceof a.ownerDocument.defaultView.HTMLHtmlElement;
}, test:function(a) {
  return a.lang ? !1 : !0;
}, code:"AX_HTML_01"});
axs.AuditRules.addRule({name:"imagesWithoutAltText", heading:"Images should have a text alternative or presentational role", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_text_02", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "img") && !axs.utils.isElementOrAncestorHidden(a);
}, test:function(a) {
  if (a.hasAttribute("alt") && "" == a.alt || "presentation" == a.getAttribute("role")) {
    return !1;
  }
  var b = {};
  axs.properties.findTextAlternatives(a, b);
  return 0 == Object.keys(b).length ? !0 : !1;
}, code:"AX_TEXT_02"});
axs.AuditRules.addRule({name:"linkWithUnclearPurpose", heading:"The purpose of each link should be clear from the link text", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_text_04", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "a") && !axs.utils.isElementOrAncestorHidden(a);
}, test:function(a, b) {
  for (var c = b || {}, d = c.blacklistPhrases || [], e = /\s+/, f = 0;f < d.length;f++) {
    var g = "^\\s*" + d[f].trim().replace(e, "\\s*") + "s*[^a-z]$";
    if ((new RegExp(g, "i")).test(a.textContent)) {
      return !0;
    }
  }
  c = c.stopwords || "click tap go here learn more this page link about".split(" ");
  d = axs.properties.findTextAlternatives(a, {});
  if (null === d || "" === d.trim()) {
    return !0;
  }
  d = d.replace(/[^a-zA-Z ]/g, "");
  for (f = 0;f < c.length;f++) {
    if (d = d.replace(new RegExp("\\b" + c[f] + "\\b", "ig"), ""), "" == d.trim()) {
      return !0;
    }
  }
  return !1;
}, code:"AX_TEXT_04"});
axs.AuditRules.addRule({name:"lowContrastElements", heading:"Text elements should have a reasonable contrast ratio", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_color_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.properties.hasDirectTextDescendant(a) && !axs.utils.isElementDisabled(a);
}, test:function(a) {
  var b = window.getComputedStyle(a, null);
  return (a = axs.utils.getContrastRatioForElementWithComputedStyle(b, a)) && axs.utils.isLowContrast(a, b);
}, code:"AX_COLOR_01"});
axs.AuditRules.addRule({name:"mainRoleOnInappropriateElement", heading:"role=main should only appear on significant elements", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_05", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[role~=main]");
}, test:function(a) {
  if (axs.utils.isInlineElement(a)) {
    return !0;
  }
  a = axs.properties.getTextFromDescendantContent(a);
  return !a || 50 > a.length ? !0 : !1;
}, code:"AX_ARIA_05"});
axs.AuditRules.addRule({name:"elementsWithMeaningfulBackgroundImage", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return !axs.utils.isElementOrAncestorHidden(a);
}, heading:"Meaningful images should not be used in element backgrounds", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_image_01", test:function(a) {
  if (a.textContent && 0 < a.textContent.length) {
    return !1;
  }
  a = window.getComputedStyle(a, null);
  var b = a.backgroundImage;
  if (!b || "undefined" === b || "none" === b || 0 != b.indexOf("url")) {
    return !1;
  }
  b = parseInt(a.width, 10);
  a = parseInt(a.height, 10);
  return 150 > b && 150 > a;
}, code:"AX_IMAGE_01"});
axs.AuditRules.addRule({name:"multipleAriaOwners", heading:"An element's ID must not be present in more that one aria-owns attribute at any time", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_07", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[aria-owns]");
}, test:function(a) {
  return axs.utils.getIdReferents("aria-owns", a).some(function(a) {
    return 1 < axs.utils.getIdReferrers("aria-owns", a).length;
  });
}, code:"AX_ARIA_07"});
axs.AuditRules.addRule({name:"multipleLabelableElementsPerLabel", heading:"A label element may not have labelable descendants other than its labeled control.", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#-ax_text_03--labels-should-only-contain-one-labelable-element", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "label");
}, test:function(a) {
  if (1 < a.querySelectorAll(axs.utils.LABELABLE_ELEMENTS_SELECTOR).length) {
    return !0;
  }
}, code:"AX_TEXT_03"});
axs.AuditRules.addRule({name:"nonExistentAriaRelatedElement", heading:"ARIA attributes which refer to other elements by ID should refer to elements which exist in the DOM", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_02", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  var b = axs.utils.getAriaPropertiesByValueType(["idref", "idref_list"]), b = axs.utils.getSelectorForAriaProperties(b);
  return axs.browserUtils.matchSelector(a, b);
}, test:function(a) {
  for (var b = axs.utils.getAriaPropertiesByValueType(["idref", "idref_list"]), b = axs.utils.getSelectorForAriaProperties(b).split(","), c = 0, d = b.length;c < d;c++) {
    var e = b[c];
    if (axs.browserUtils.matchSelector(a, e)) {
      var e = e.match(/aria-[^\]]+/)[0], f = a.getAttribute(e);
      if (!axs.utils.getAriaPropertyValue(e, f, a).valid) {
        return !0;
      }
    }
  }
  return !1;
}, code:"AX_ARIA_02"});
axs.AuditRules.addRule({name:"pageWithoutTitle", heading:"The web page should have a title that describes topic or purpose", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_title_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return "html" == a.tagName.toLowerCase();
}, test:function(a) {
  a = a.querySelector("head");
  return a ? (a = a.querySelector("title")) ? !a.textContent : !0 : !0;
}, code:"AX_TITLE_01"});
axs.AuditRules.addRule({name:"requiredAriaAttributeMissing", heading:"Elements with ARIA roles must have all required attributes for that role", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_03", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[role]");
}, test:function(a) {
  var b = axs.utils.getRoles(a);
  if (!b.valid) {
    return !1;
  }
  for (var c = 0;c < b.roles.length;c++) {
    var d = b.roles[c].details.requiredPropertiesSet, e;
    for (e in d) {
      if (d = e.replace(/^aria-/, ""), !("defaultValue" in axs.constants.ARIA_PROPERTIES[d] || a.hasAttribute(e)) && 0 > axs.properties.getNativelySupportedAttributes(a).indexOf(e)) {
        return !0;
      }
    }
  }
}, code:"AX_ARIA_03"});
(function() {
  function a(a) {
    a = axs.utils.getRoles(a);
    if (!a || !a.applied) {
      return [];
    }
    a = a.applied;
    return a.valid ? a.details.mustcontain || [] : [];
  }
  axs.AuditRules.addRule({name:"requiredOwnedAriaRoleMissing", heading:"Elements with ARIA roles must ensure required owned elements are present", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_08", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(b) {
    return axs.browserUtils.matchSelector(b, "[role]") ? 0 < a(b).length : !1;
  }, test:function(b) {
    if ("true" === b.getAttribute("aria-busy")) {
      return !1;
    }
    for (var c = a(b), d = c.length - 1;0 <= d;d--) {
      var e = axs.utils.findDescendantsWithRole(b, c[d]);
      if (e && e.length) {
        return !1;
      }
    }
    b = axs.utils.getIdReferents("aria-owns", b);
    for (d = b.length - 1;0 <= d;d--) {
      if ((e = axs.utils.getRoles(b[d], !0)) && e.applied) {
        for (var e = e.applied, f = c.length - 1;0 <= f;f--) {
          if (e.name === c[f]) {
            return !1;
          }
        }
      }
    }
    return !0;
  }, code:"AX_ARIA_08"});
})();
axs.AuditRules.addRule({name:"tabIndexGreaterThanZero", heading:"Avoid positive integer values for tabIndex", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_03", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "[tabindex]");
}, test:function(a) {
  if (0 < a.tabIndex) {
    return !0;
  }
}, code:"AX_FOCUS_03"});
axs.AuditRules.addRule({name:"unfocusableElementsWithOnClick", heading:"Elements with onclick handlers must be focusable", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_focus_02", severity:axs.constants.Severity.WARNING, opt_requiresConsoleAPI:!0, relevantElementMatcher:function(a) {
  return a instanceof a.ownerDocument.defaultView.HTMLBodyElement || axs.utils.isElementOrAncestorHidden(a) ? !1 : "click" in getEventListeners(a) ? !0 : !1;
}, test:function(a) {
  return !a.hasAttribute("tabindex") && !axs.utils.isElementImplicitlyFocusable(a) && !a.disabled;
}, code:"AX_FOCUS_02"});
(function() {
  var a = /^aria\-/, b = axs.utils.getSelectorForAriaProperties(axs.constants.ARIA_PROPERTIES);
  axs.AuditRules.addRule({name:"unsupportedAriaAttribute", heading:"This element has an unsupported ARIA attribute", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_aria_10", severity:axs.constants.Severity.SEVERE, relevantElementMatcher:function(a) {
    return axs.browserUtils.matchSelector(a, b);
  }, test:function(b) {
    var d = axs.utils.getRoles(b, !0), d = d && d.applied ? d.applied.details.propertiesSet : axs.constants.GLOBAL_PROPERTIES;
    b = b.attributes;
    for (var e = 0, f = b.length;e < f;e++) {
      var g = b[e].name;
      if (a.test(g)) {
        var h = g.replace(a, "");
        if (axs.constants.ARIA_PROPERTIES.hasOwnProperty(h) && !(g in d)) {
          return !0;
        }
      }
    }
    return !1;
  }, code:"AX_ARIA_10"});
})();
axs.AuditRules.addRule({name:"videoWithoutCaptions", heading:"Video elements should use <track> elements to provide captions", url:"https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules#ax_video_01", severity:axs.constants.Severity.WARNING, relevantElementMatcher:function(a) {
  return axs.browserUtils.matchSelector(a, "video");
}, test:function(a) {
  return !a.querySelectorAll("track[kind=captions]").length;
}, code:"AX_VIDEO_01"});

