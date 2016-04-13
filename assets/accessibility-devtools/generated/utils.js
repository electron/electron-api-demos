if (!axs) var axs = {}; if (!goog) var goog = {}; axs.color = {};
axs.color.Color = function(a, b, c, d) {
  this.red = a;
  this.green = b;
  this.blue = c;
  this.alpha = d;
};
axs.color.YCbCr = function(a) {
  this.luma = this.z = a[0];
  this.Cb = this.x = a[1];
  this.Cr = this.y = a[2];
};
axs.color.YCbCr.prototype = {multiply:function(a) {
  return new axs.color.YCbCr([this.luma * a, this.Cb * a, this.Cr * a]);
}, add:function(a) {
  return new axs.color.YCbCr([this.luma + a.luma, this.Cb + a.Cb, this.Cr + a.Cr]);
}, subtract:function(a) {
  return new axs.color.YCbCr([this.luma - a.luma, this.Cb - a.Cb, this.Cr - a.Cr]);
}};
axs.color.calculateContrastRatio = function(a, b) {
  1 > a.alpha && (a = axs.color.flattenColors(a, b));
  var c = axs.color.calculateLuminance(a), d = axs.color.calculateLuminance(b);
  return (Math.max(c, d) + .05) / (Math.min(c, d) + .05);
};
axs.color.calculateLuminance = function(a) {
  return axs.color.toYCbCr(a).luma;
};
axs.color.luminanceRatio = function(a, b) {
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};
axs.color.parseColor = function(a) {
  if ("transparent" === a) {
    return new axs.color.Color(0, 0, 0, 0);
  }
  var b = a.match(/^rgb\((\d+), (\d+), (\d+)\)$/);
  if (b) {
    a = parseInt(b[1], 10);
    var c = parseInt(b[2], 10), d = parseInt(b[3], 10);
    return new axs.color.Color(a, c, d, 1);
  }
  return (b = a.match(/^rgba\((\d+), (\d+), (\d+), (\d*(\.\d+)?)\)/)) ? (a = parseInt(b[1], 10), c = parseInt(b[2], 10), d = parseInt(b[3], 10), b = parseFloat(b[4]), new axs.color.Color(a, c, d, b)) : null;
};
axs.color.colorChannelToString = function(a) {
  a = Math.round(a);
  return 15 >= a ? "0" + a.toString(16) : a.toString(16);
};
axs.color.colorToString = function(a) {
  return 1 == a.alpha ? "#" + axs.color.colorChannelToString(a.red) + axs.color.colorChannelToString(a.green) + axs.color.colorChannelToString(a.blue) : "rgba(" + [a.red, a.green, a.blue, a.alpha].join() + ")";
};
axs.color.luminanceFromContrastRatio = function(a, b, c) {
  return c ? (a + .05) * b - .05 : (a + .05) / b - .05;
};
axs.color.translateColor = function(a, b) {
  for (var c = b > a.luma ? axs.color.WHITE_YCC : axs.color.BLACK_YCC, d = c == axs.color.WHITE_YCC ? axs.color.YCC_CUBE_FACES_WHITE : axs.color.YCC_CUBE_FACES_BLACK, e = new axs.color.YCbCr([0, a.Cb, a.Cr]), f = new axs.color.YCbCr([1, a.Cb, a.Cr]), f = {a:e, b:f}, e = null, g = 0;g < d.length && !(e = axs.color.findIntersection(f, d[g]), 0 <= e.z && 1 >= e.z);g++) {
  }
  if (!e) {
    throw "Couldn't find intersection with YCbCr color cube for Cb=" + a.Cb + ", Cr=" + a.Cr + ".";
  }
  if (e.x != a.x || e.y != a.y) {
    throw "Intersection has wrong Cb/Cr values.";
  }
  if (Math.abs(c.luma - e.luma) < Math.abs(c.luma - b)) {
    return c = [b, a.Cb, a.Cr], axs.color.fromYCbCrArray(c);
  }
  c = (b - e.luma) / (c.luma - e.luma);
  c = [b, e.Cb - e.Cb * c, e.Cr - e.Cr * c];
  return axs.color.fromYCbCrArray(c);
};
axs.color.suggestColors = function(a, b, c) {
  var d = {}, e = axs.color.calculateLuminance(a), f = axs.color.calculateLuminance(b), g = f > e, h = axs.color.toYCbCr(b), k = axs.color.toYCbCr(a), m;
  for (m in c) {
    var l = c[m], n = axs.color.luminanceFromContrastRatio(e, l + .02, g);
    if (1 >= n && 0 <= n) {
      var p = axs.color.translateColor(h, n), l = axs.color.calculateContrastRatio(p, a), n = {};
      n.fg = axs.color.colorToString(p);
      n.bg = axs.color.colorToString(a);
      n.contrast = l.toFixed(2);
      d[m] = n;
    } else {
      l = axs.color.luminanceFromContrastRatio(f, l + .02, !g), 1 >= l && 0 <= l && (p = axs.color.translateColor(k, l), l = axs.color.calculateContrastRatio(b, p), n = {}, n.bg = axs.color.colorToString(p), n.fg = axs.color.colorToString(b), n.contrast = l.toFixed(2), d[m] = n);
    }
  }
  return d;
};
axs.color.flattenColors = function(a, b) {
  var c = a.alpha;
  return new axs.color.Color((1 - c) * b.red + c * a.red, (1 - c) * b.green + c * a.green, (1 - c) * b.blue + c * a.blue, a.alpha + b.alpha * (1 - a.alpha));
};
axs.color.multiplyMatrixVector = function(a, b) {
  var c = b[0], d = b[1], e = b[2];
  return [a[0][0] * c + a[0][1] * d + a[0][2] * e, a[1][0] * c + a[1][1] * d + a[1][2] * e, a[2][0] * c + a[2][1] * d + a[2][2] * e];
};
axs.color.toYCbCr = function(a) {
  var b = a.red / 255, c = a.green / 255;
  a = a.blue / 255;
  b = .03928 >= b ? b / 12.92 : Math.pow((b + .055) / 1.055, 2.4);
  c = .03928 >= c ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4);
  a = .03928 >= a ? a / 12.92 : Math.pow((a + .055) / 1.055, 2.4);
  return new axs.color.YCbCr(axs.color.multiplyMatrixVector(axs.color.YCC_MATRIX, [b, c, a]));
};
axs.color.fromYCbCr = function(a) {
  return axs.color.fromYCbCrArray([a.luma, a.Cb, a.Cr]);
};
axs.color.fromYCbCrArray = function(a) {
  var b = axs.color.multiplyMatrixVector(axs.color.INVERTED_YCC_MATRIX, a), c = b[0];
  a = b[1];
  b = b[2];
  c = .00303949 >= c ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - .055;
  a = .00303949 >= a ? 12.92 * a : 1.055 * Math.pow(a, 1 / 2.4) - .055;
  b = .00303949 >= b ? 12.92 * b : 1.055 * Math.pow(b, 1 / 2.4) - .055;
  c = Math.min(Math.max(Math.round(255 * c), 0), 255);
  a = Math.min(Math.max(Math.round(255 * a), 0), 255);
  b = Math.min(Math.max(Math.round(255 * b), 0), 255);
  return new axs.color.Color(c, a, b, 1);
};
axs.color.RGBToYCbCrMatrix = function(a, b) {
  return [[a, 1 - a - b, b], [-a / (2 - 2 * b), (a + b - 1) / (2 - 2 * b), (1 - b) / (2 - 2 * b)], [(1 - a) / (2 - 2 * a), (a + b - 1) / (2 - 2 * a), -b / (2 - 2 * a)]];
};
axs.color.invert3x3Matrix = function(a) {
  var b = a[0][0], c = a[0][1], d = a[0][2], e = a[1][0], f = a[1][1], g = a[1][2], h = a[2][0], k = a[2][1];
  a = a[2][2];
  return axs.color.scalarMultiplyMatrix([[f * a - g * k, d * k - c * a, c * g - d * f], [g * h - e * a, b * a - d * h, d * e - b * g], [e * k - f * h, h * c - b * k, b * f - c * e]], 1 / (b * (f * a - g * k) - c * (a * e - g * h) + d * (e * k - f * h)));
};
axs.color.findIntersection = function(a, b) {
  var c = [a.a.x - b.p0.x, a.a.y - b.p0.y, a.a.z - b.p0.z], d = axs.color.invert3x3Matrix([[a.a.x - a.b.x, b.p1.x - b.p0.x, b.p2.x - b.p0.x], [a.a.y - a.b.y, b.p1.y - b.p0.y, b.p2.y - b.p0.y], [a.a.z - a.b.z, b.p1.z - b.p0.z, b.p2.z - b.p0.z]]), c = axs.color.multiplyMatrixVector(d, c)[0];
  return a.a.add(a.b.subtract(a.a).multiply(c));
};
axs.color.scalarMultiplyMatrix = function(a, b) {
  for (var c = [], d = 0;3 > d;d++) {
    c[d] = axs.color.scalarMultiplyVector(a[d], b);
  }
  return c;
};
axs.color.scalarMultiplyVector = function(a, b) {
  for (var c = [], d = 0;d < a.length;d++) {
    c[d] = a[d] * b;
  }
  return c;
};
axs.color.kR = .2126;
axs.color.kB = .0722;
axs.color.YCC_MATRIX = axs.color.RGBToYCbCrMatrix(axs.color.kR, axs.color.kB);
axs.color.INVERTED_YCC_MATRIX = axs.color.invert3x3Matrix(axs.color.YCC_MATRIX);
axs.color.BLACK = new axs.color.Color(0, 0, 0, 1);
axs.color.BLACK_YCC = axs.color.toYCbCr(axs.color.BLACK);
axs.color.WHITE = new axs.color.Color(255, 255, 255, 1);
axs.color.WHITE_YCC = axs.color.toYCbCr(axs.color.WHITE);
axs.color.RED = new axs.color.Color(255, 0, 0, 1);
axs.color.RED_YCC = axs.color.toYCbCr(axs.color.RED);
axs.color.GREEN = new axs.color.Color(0, 255, 0, 1);
axs.color.GREEN_YCC = axs.color.toYCbCr(axs.color.GREEN);
axs.color.BLUE = new axs.color.Color(0, 0, 255, 1);
axs.color.BLUE_YCC = axs.color.toYCbCr(axs.color.BLUE);
axs.color.CYAN = new axs.color.Color(0, 255, 255, 1);
axs.color.CYAN_YCC = axs.color.toYCbCr(axs.color.CYAN);
axs.color.MAGENTA = new axs.color.Color(255, 0, 255, 1);
axs.color.MAGENTA_YCC = axs.color.toYCbCr(axs.color.MAGENTA);
axs.color.YELLOW = new axs.color.Color(255, 255, 0, 1);
axs.color.YELLOW_YCC = axs.color.toYCbCr(axs.color.YELLOW);
axs.color.YCC_CUBE_FACES_BLACK = [{p0:axs.color.BLACK_YCC, p1:axs.color.RED_YCC, p2:axs.color.GREEN_YCC}, {p0:axs.color.BLACK_YCC, p1:axs.color.GREEN_YCC, p2:axs.color.BLUE_YCC}, {p0:axs.color.BLACK_YCC, p1:axs.color.BLUE_YCC, p2:axs.color.RED_YCC}];
axs.color.YCC_CUBE_FACES_WHITE = [{p0:axs.color.WHITE_YCC, p1:axs.color.CYAN_YCC, p2:axs.color.MAGENTA_YCC}, {p0:axs.color.WHITE_YCC, p1:axs.color.MAGENTA_YCC, p2:axs.color.YELLOW_YCC}, {p0:axs.color.WHITE_YCC, p1:axs.color.YELLOW_YCC, p2:axs.color.CYAN_YCC}];
axs.browserUtils = {};
axs.browserUtils.matchSelector = function(a, b) {
  return a.matches ? a.matches(b) : a.webkitMatchesSelector ? a.webkitMatchesSelector(b) : a.mozMatchesSelector ? a.mozMatchesSelector(b) : a.msMatchesSelector ? a.msMatchesSelector(b) : !1;
};
axs.utils = {};
axs.utils.FOCUSABLE_ELEMENTS_SELECTOR = "input:not([type=hidden]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),a[href],iframe,[tabindex]";
axs.utils.LABELABLE_ELEMENTS_SELECTOR = "button,input:not([type=hidden]),keygen,meter,output,progress,select,textarea";
axs.utils.parentElement = function(a) {
  if (!a) {
    return null;
  }
  if (a.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
    return a.host;
  }
  var b = a.parentElement;
  if (b) {
    return b;
  }
  a = a.parentNode;
  if (!a) {
    return null;
  }
  switch(a.nodeType) {
    case Node.ELEMENT_NODE:
      return a;
    case Node.DOCUMENT_FRAGMENT_NODE:
      return a.host;
    default:
      return null;
  }
};
axs.utils.asElement = function(a) {
  switch(a.nodeType) {
    case Node.COMMENT_NODE:
      return null;
    case Node.ELEMENT_NODE:
      if ("script" == a.tagName.toLowerCase()) {
        return null;
      }
      break;
    case Node.TEXT_NODE:
      a = axs.utils.parentElement(a);
      break;
    default:
      return console.warn("Unhandled node type: ", a.nodeType), null;
  }
  return a;
};
axs.utils.elementIsTransparent = function(a) {
  return "0" == a.style.opacity;
};
axs.utils.elementHasZeroArea = function(a) {
  a = a.getBoundingClientRect();
  var b = a.top - a.bottom;
  return a.right - a.left && b ? !1 : !0;
};
axs.utils.elementIsOutsideScrollArea = function(a) {
  for (var b = axs.utils.parentElement(a), c = a.ownerDocument.defaultView;b != c.document.body;) {
    if (axs.utils.isClippedBy(a, b)) {
      return !0;
    }
    if (axs.utils.canScrollTo(a, b) && !axs.utils.elementIsOutsideScrollArea(b)) {
      return !1;
    }
    b = axs.utils.parentElement(b);
  }
  return !axs.utils.canScrollTo(a, c.document.body);
};
axs.utils.canScrollTo = function(a, b) {
  var c = a.getBoundingClientRect(), d = b.getBoundingClientRect(), e = d.top, f = d.left, g = e - b.scrollTop, e = e - b.scrollTop + b.scrollHeight, h = f - b.scrollLeft + b.scrollWidth;
  if (c.right < f - b.scrollLeft || c.bottom < g || c.left > h || c.top > e) {
    return !1;
  }
  f = a.ownerDocument.defaultView;
  g = f.getComputedStyle(b);
  return c.left > d.right || c.top > d.bottom ? "scroll" == g.overflow || "auto" == g.overflow || b instanceof f.HTMLBodyElement : !0;
};
axs.utils.isClippedBy = function(a, b) {
  var c = a.getBoundingClientRect(), d = b.getBoundingClientRect(), e = d.top - b.scrollTop, f = d.left - b.scrollLeft, g = a.ownerDocument.defaultView.getComputedStyle(b);
  return (c.right < d.left || c.bottom < d.top || c.left > d.right || c.top > d.bottom) && "hidden" == g.overflow ? !0 : c.right < f || c.bottom < e ? "visible" != g.overflow : !1;
};
axs.utils.isAncestor = function(a, b) {
  return null == b ? !1 : b === a ? !0 : axs.utils.isAncestor(a, b.parentNode);
};
axs.utils.overlappingElements = function(a) {
  if (axs.utils.elementHasZeroArea(a)) {
    return null;
  }
  for (var b = [], c = a.getClientRects(), d = 0;d < c.length;d++) {
    var e = c[d], e = document.elementFromPoint((e.left + e.right) / 2, (e.top + e.bottom) / 2);
    if (null != e && e != a && !axs.utils.isAncestor(e, a) && !axs.utils.isAncestor(a, e)) {
      var f = window.getComputedStyle(e, null);
      f && (f = axs.utils.getBgColor(f, e)) && 0 < f.alpha && 0 > b.indexOf(e) && b.push(e);
    }
  }
  return b;
};
axs.utils.elementIsHtmlControl = function(a) {
  var b = a.ownerDocument.defaultView;
  return a instanceof b.HTMLButtonElement || a instanceof b.HTMLInputElement || a instanceof b.HTMLSelectElement || a instanceof b.HTMLTextAreaElement ? !0 : !1;
};
axs.utils.elementIsAriaWidget = function(a) {
  return a.hasAttribute("role") && (a = a.getAttribute("role")) && (a = axs.constants.ARIA_ROLES[a]) && "widget" in a.allParentRolesSet ? !0 : !1;
};
axs.utils.elementIsVisible = function(a) {
  return axs.utils.elementIsTransparent(a) || axs.utils.elementHasZeroArea(a) || axs.utils.elementIsOutsideScrollArea(a) || axs.utils.overlappingElements(a).length ? !1 : !0;
};
axs.utils.isLargeFont = function(a) {
  var b = a.fontSize;
  a = "bold" == a.fontWeight;
  var c = b.match(/(\d+)px/);
  if (c) {
    b = parseInt(c[1], 10);
    if (c = window.getComputedStyle(document.body, null).fontSize.match(/(\d+)px/)) {
      var d = parseInt(c[1], 10), c = 1.2 * d, d = 1.5 * d
    } else {
      c = 19.2, d = 24;
    }
    return a && b >= c || b >= d;
  }
  if (c = b.match(/(\d+)em/)) {
    return b = parseInt(c[1], 10), a && 1.2 <= b || 1.5 <= b ? !0 : !1;
  }
  if (c = b.match(/(\d+)%/)) {
    return b = parseInt(c[1], 10), a && 120 <= b || 150 <= b ? !0 : !1;
  }
  if (c = b.match(/(\d+)pt/)) {
    if (b = parseInt(c[1], 10), a && 14 <= b || 18 <= b) {
      return !0;
    }
  }
  return !1;
};
axs.utils.getBgColor = function(a, b) {
  var c = axs.color.parseColor(a.backgroundColor);
  if (!c) {
    return null;
  }
  1 > a.opacity && (c.alpha *= a.opacity);
  if (1 > c.alpha) {
    var d = axs.utils.getParentBgColor(b);
    if (null == d) {
      return null;
    }
    c = axs.color.flattenColors(c, d);
  }
  return c;
};
axs.utils.getParentBgColor = function(a) {
  var b = a;
  a = [];
  for (var c = null;b = axs.utils.parentElement(b);) {
    var d = window.getComputedStyle(b, null);
    if (d) {
      var e = axs.color.parseColor(d.backgroundColor);
      if (e && (1 > d.opacity && (e.alpha *= d.opacity), 0 != e.alpha && (a.push(e), 1 == e.alpha))) {
        c = !0;
        break;
      }
    }
  }
  c || a.push(new axs.color.Color(255, 255, 255, 1));
  for (b = a.pop();a.length;) {
    c = a.pop(), b = axs.color.flattenColors(c, b);
  }
  return b;
};
axs.utils.getFgColor = function(a, b, c) {
  var d = axs.color.parseColor(a.color);
  if (!d) {
    return null;
  }
  1 > d.alpha && (d = axs.color.flattenColors(d, c));
  1 > a.opacity && (b = axs.utils.getParentBgColor(b), d.alpha *= a.opacity, d = axs.color.flattenColors(d, b));
  return d;
};
axs.utils.getContrastRatioForElement = function(a) {
  var b = window.getComputedStyle(a, null);
  return axs.utils.getContrastRatioForElementWithComputedStyle(b, a);
};
axs.utils.getContrastRatioForElementWithComputedStyle = function(a, b) {
  if (axs.utils.isElementHidden(b)) {
    return null;
  }
  var c = axs.utils.getBgColor(a, b);
  if (!c) {
    return null;
  }
  var d = axs.utils.getFgColor(a, b, c);
  return d ? axs.color.calculateContrastRatio(d, c) : null;
};
axs.utils.isNativeTextElement = function(a) {
  var b = a.tagName.toLowerCase();
  a = a.type ? a.type.toLowerCase() : "";
  if ("textarea" == b) {
    return !0;
  }
  if ("input" != b) {
    return !1;
  }
  switch(a) {
    case "email":
    ;
    case "number":
    ;
    case "password":
    ;
    case "search":
    ;
    case "text":
    ;
    case "tel":
    ;
    case "url":
    ;
    case "":
      return !0;
    default:
      return !1;
  }
};
axs.utils.isLowContrast = function(a, b, c) {
  a = Math.round(10 * a) / 10;
  return c ? 4.5 > a || !axs.utils.isLargeFont(b) && 7 > a : 3 > a || !axs.utils.isLargeFont(b) && 4.5 > a;
};
axs.utils.hasLabel = function(a) {
  var b = a.tagName.toLowerCase(), c = a.type ? a.type.toLowerCase() : "";
  if (a.hasAttribute("aria-label") || a.hasAttribute("title") || "img" == b && a.hasAttribute("alt") || "input" == b && "image" == c && a.hasAttribute("alt") || "input" == b && ("submit" == c || "reset" == c) || a.hasAttribute("aria-labelledby") || a.hasAttribute("id") && 0 < document.querySelectorAll('label[for="' + a.id + '"]').length) {
    return !0;
  }
  for (b = axs.utils.parentElement(a);b;) {
    if ("label" == b.tagName.toLowerCase() && b.control == a) {
      return !0;
    }
    b = axs.utils.parentElement(b);
  }
  return !1;
};
axs.utils.isNativelyDisableable = function(a) {
  return a.tagName.toUpperCase() in axs.constants.NATIVELY_DISABLEABLE;
};
axs.utils.isElementDisabled = function(a) {
  if (axs.browserUtils.matchSelector(a, "[aria-disabled=true], [aria-disabled=true] *")) {
    return !0;
  }
  if (!axs.utils.isNativelyDisableable(a) || axs.browserUtils.matchSelector(a, "fieldset>legend:first-of-type *")) {
    return !1;
  }
  for (;null !== a;a = axs.utils.parentElement(a)) {
    if (axs.utils.isNativelyDisableable(a) && a.hasAttribute("disabled")) {
      return !0;
    }
  }
  return !1;
};
axs.utils.isElementHidden = function(a) {
  if (!(a instanceof a.ownerDocument.defaultView.HTMLElement)) {
    return !1;
  }
  if (a.hasAttribute("chromevoxignoreariahidden")) {
    var b = !0
  }
  var c = window.getComputedStyle(a, null);
  return "none" == c.display || "hidden" == c.visibility ? !0 : a.hasAttribute("aria-hidden") && "true" == a.getAttribute("aria-hidden").toLowerCase() ? !b : !1;
};
axs.utils.isElementOrAncestorHidden = function(a) {
  return axs.utils.isElementHidden(a) ? !0 : axs.utils.parentElement(a) ? axs.utils.isElementOrAncestorHidden(axs.utils.parentElement(a)) : !1;
};
axs.utils.isInlineElement = function(a) {
  a = a.tagName.toUpperCase();
  return axs.constants.InlineElements[a];
};
axs.utils.getRoles = function(a, b) {
  if (!a || a.nodeType !== Node.ELEMENT_NODE || !a.hasAttribute("role") && !b) {
    return null;
  }
  var c = a.getAttribute("role");
  !c && b && (c = axs.properties.getImplicitRole(a));
  if (!c) {
    return null;
  }
  for (var c = c.split(" "), d = {roles:[], valid:!1}, e = 0;e < c.length;e++) {
    var f = c[e], g = axs.constants.ARIA_ROLES[f], f = {name:f};
    g && !g.abstract ? (f.details = g, d.applied || (d.applied = f), f.valid = d.valid = !0) : f.valid = !1;
    d.roles.push(f);
  }
  return d;
};
axs.utils.getAriaPropertyValue = function(a, b, c) {
  var d = a.replace(/^aria-/, ""), e = axs.constants.ARIA_PROPERTIES[d], d = {name:a, rawValue:b};
  if (!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d;
  }
  e = e.valueType;
  if (!e) {
    return d.valid = !1, d.reason = '"' + a + '" is not a valid ARIA property', d;
  }
  switch(e) {
    case "idref":
      a = axs.utils.isValidIDRefValue(b, c), d.valid = a.valid, d.reason = a.reason, d.idref = a.idref;
    case "idref_list":
      a = b.split(/\s+/);
      d.valid = !0;
      for (b = 0;b < a.length;b++) {
        e = axs.utils.isValidIDRefValue(a[b], c), e.valid || (d.valid = !1), d.values ? d.values.push(e) : d.values = [e];
      }
      return d;
    case "integer":
      c = axs.utils.isValidNumber(b);
      if (!c.valid) {
        return d.valid = !1, d.reason = c.reason, d;
      }
      Math.floor(c.value) !== c.value ? (d.valid = !1, d.reason = "" + b + " is not a whole integer") : (d.valid = !0, d.value = c.value);
      return d;
    case "decimal":
    ;
    case "number":
      c = axs.utils.isValidNumber(b);
      d.valid = c.valid;
      if (!c.valid) {
        return d.reason = c.reason, d;
      }
      d.value = c.value;
      return d;
    case "string":
      return d.valid = !0, d.value = b, d;
    case "token":
      return c = axs.utils.isValidTokenValue(a, b.toLowerCase()), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d;
    case "token_list":
      e = b.split(/\s+/);
      d.valid = !0;
      for (b = 0;b < e.length;b++) {
        c = axs.utils.isValidTokenValue(a, e[b].toLowerCase()), c.valid || (d.valid = !1, d.reason ? (d.reason = [d.reason], d.reason.push(c.reason)) : (d.reason = c.reason, d.possibleValues = c.possibleValues)), d.values ? d.values.push(c.value) : d.values = [c.value];
      }
      return d;
    case "tristate":
      return c = axs.utils.isPossibleValue(b.toLowerCase(), axs.constants.MIXED_VALUES, a), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d;
    case "boolean":
      return c = axs.utils.isValidBoolean(b), c.valid ? (d.valid = !0, d.value = c.value) : (d.valid = !1, d.value = b, d.reason = c.reason), d;
  }
  d.valid = !1;
  d.reason = "Not a valid ARIA property";
  return d;
};
axs.utils.isValidTokenValue = function(a, b) {
  var c = a.replace(/^aria-/, "");
  return axs.utils.isPossibleValue(b, axs.constants.ARIA_PROPERTIES[c].valuesSet, a);
};
axs.utils.isPossibleValue = function(a, b, c) {
  return b[a] ? {valid:!0, value:a} : {valid:!1, value:a, reason:'"' + a + '" is not a valid value for ' + c, possibleValues:Object.keys(b)};
};
axs.utils.isValidBoolean = function(a) {
  try {
    var b = JSON.parse(a);
  } catch (c) {
    b = "";
  }
  return "boolean" != typeof b ? {valid:!1, value:a, reason:'"' + a + '" is not a true/false value'} : {valid:!0, value:b};
};
axs.utils.isValidIDRefValue = function(a, b) {
  return 0 == a.length ? {valid:!0, idref:a} : b.ownerDocument.getElementById(a) ? {valid:!0, idref:a} : {valid:!1, idref:a, reason:'No element with ID "' + a + '"'};
};
axs.utils.isValidNumber = function(a) {
  var b = {valid:!1, value:a, reason:'"' + a + '" is not a number'};
  if (!a) {
    return b;
  }
  if (/^0x/i.test(a)) {
    return b.reason = '"' + a + '" is not a decimal number', b;
  }
  a *= 1;
  return isFinite(a) ? {valid:!0, value:a} : b;
};
axs.utils.isElementImplicitlyFocusable = function(a) {
  var b = a.ownerDocument.defaultView;
  return a instanceof b.HTMLAnchorElement || a instanceof b.HTMLAreaElement ? a.hasAttribute("href") : a instanceof b.HTMLInputElement || a instanceof b.HTMLSelectElement || a instanceof b.HTMLTextAreaElement || a instanceof b.HTMLButtonElement || a instanceof b.HTMLIFrameElement ? !a.disabled : !1;
};
axs.utils.values = function(a) {
  var b = [], c;
  for (c in a) {
    a.hasOwnProperty(c) && "function" != typeof a[c] && b.push(a[c]);
  }
  return b;
};
axs.utils.namedValues = function(a) {
  var b = {}, c;
  for (c in a) {
    a.hasOwnProperty(c) && "function" != typeof a[c] && (b[c] = a[c]);
  }
  return b;
};
axs.utils.getQuerySelectorText = function(a) {
  if (null == a || "HTML" == a.tagName) {
    return "html";
  }
  if ("BODY" == a.tagName) {
    return "body";
  }
  if (a.hasAttribute) {
    if (a.id) {
      return "#" + a.id;
    }
    if (a.className) {
      for (var b = "", c = 0;c < a.classList.length;c++) {
        b += "." + a.classList[c];
      }
      var d = 0;
      if (a.parentNode) {
        for (c = 0;c < a.parentNode.children.length;c++) {
          var e = a.parentNode.children[c];
          axs.browserUtils.matchSelector(e, b) && d++;
          if (e === a) {
            break;
          }
        }
      } else {
        d = 1;
      }
      if (1 == d) {
        return axs.utils.getQuerySelectorText(a.parentNode) + " > " + b;
      }
    }
    if (a.parentNode) {
      b = a.parentNode.children;
      d = 1;
      for (c = 0;b[c] !== a;) {
        b[c].tagName == a.tagName && d++, c++;
      }
      c = "";
      "BODY" != a.parentNode.tagName && (c = axs.utils.getQuerySelectorText(a.parentNode) + " > ");
      return 1 == d ? c + a.tagName : c + a.tagName + ":nth-of-type(" + d + ")";
    }
  } else {
    if (a.selectorText) {
      return a.selectorText;
    }
  }
  return "";
};
axs.utils.getIdReferrers = function(a, b) {
  if (!b) {
    return null;
  }
  var c = b.id, d = a.replace(/^aria-/, ""), d = axs.constants.ARIA_PROPERTIES[d];
  if (!c || !d) {
    return null;
  }
  d = d.valueType;
  return "idref_list" === d || "idref" === d ? (c = c.replace(/'/g, "\\'"), b.ownerDocument.querySelectorAll("[" + a + "~='" + c + "']")) : null;
};
axs.utils.getIdReferents = function(a, b) {
  var c = [], d = a.replace(/^aria-/, ""), d = axs.constants.ARIA_PROPERTIES[d];
  if (!d || !b.hasAttribute(a)) {
    return c;
  }
  d = d.valueType;
  if ("idref_list" === d || "idref" === d) {
    for (var d = b.ownerDocument, e = b.getAttribute(a), e = e.split(/\s+/), f = 0, g = e.length;f < g;f++) {
      var h = d.getElementById(e[f]);
      h && (c[c.length] = h);
    }
  }
  return c;
};
axs.utils.getAriaPropertiesByValueType = function(a) {
  var b = {}, c;
  for (c in axs.constants.ARIA_PROPERTIES) {
    var d = axs.constants.ARIA_PROPERTIES[c];
    d && 0 <= a.indexOf(d.valueType) && (b[c] = d);
  }
  return b;
};
axs.utils.getSelectorForAriaProperties = function(a) {
  a = Object.keys(a).map(function(a) {
    return "[aria-" + a + "]";
  });
  a.sort();
  return a.join(",");
};
axs.utils.findDescendantsWithRole = function(a, b) {
  if (!a || !b) {
    return [];
  }
  var c = axs.properties.getSelectorForRole(b);
  if (c && (c = a.querySelectorAll(c))) {
    c = Array.prototype.map.call(c, function(a) {
      return a;
    });
  } else {
    return [];
  }
  return c;
};
axs.properties = {};
axs.properties.TEXT_CONTENT_XPATH = './/text()[normalize-space(.)!=""]/parent::*[name()!="script"]';
axs.properties.getFocusProperties = function(a) {
  var b = {}, c = a.getAttribute("tabindex");
  void 0 != c ? b.tabindex = {value:c, valid:!0} : axs.utils.isElementImplicitlyFocusable(a) && (b.implicitlyFocusable = {value:!0, valid:!0});
  if (0 == Object.keys(b).length) {
    return null;
  }
  var d = axs.utils.elementIsTransparent(a), e = axs.utils.elementHasZeroArea(a), f = axs.utils.elementIsOutsideScrollArea(a), g = axs.utils.overlappingElements(a);
  if (d || e || f || 0 < g.length) {
    var c = axs.utils.isElementOrAncestorHidden(a), h = {value:!1, valid:c};
    d && (h.transparent = !0);
    e && (h.zeroArea = !0);
    f && (h.outsideScrollArea = !0);
    g && 0 < g.length && (h.overlappingElements = g);
    d = {value:c, valid:c};
    c && (d.reason = axs.properties.getHiddenReason(a));
    h.hidden = d;
    b.visible = h;
  } else {
    b.visible = {value:!0, valid:!0};
  }
  return b;
};
axs.properties.getHiddenReason = function(a) {
  if (!(a && a instanceof a.ownerDocument.defaultView.HTMLElement)) {
    return null;
  }
  if (a.hasAttribute("chromevoxignoreariahidden")) {
    var b = !0
  }
  var c = window.getComputedStyle(a, null);
  return "none" == c.display ? {property:"display: none", on:a} : "hidden" == c.visibility ? {property:"visibility: hidden", on:a} : a.hasAttribute("aria-hidden") && "true" == a.getAttribute("aria-hidden").toLowerCase() && !b ? {property:"aria-hidden", on:a} : axs.properties.getHiddenReason(axs.utils.parentElement(a));
};
axs.properties.getColorProperties = function(a) {
  var b = {};
  (a = axs.properties.getContrastRatioProperties(a)) && (b.contrastRatio = a);
  return 0 == Object.keys(b).length ? null : b;
};
axs.properties.hasDirectTextDescendant = function(a) {
  function b() {
    for (var b = c.evaluate(axs.properties.TEXT_CONTENT_XPATH, a, null, XPathResult.ANY_TYPE, null), e = b.iterateNext();null != e;e = b.iterateNext()) {
      if (e === a) {
        return !0;
      }
    }
    return !1;
  }
  var c;
  c = a.nodeType == Node.DOCUMENT_NODE ? a : a.ownerDocument;
  return c.evaluate ? b() : function() {
    for (var b = c.createTreeWalker(a, NodeFilter.SHOW_TEXT, null, !1);b.nextNode();) {
      var e = b.currentNode, f = e.parentNode.tagName.toLowerCase();
      if (e.nodeValue.trim() && "script" !== f && a !== e) {
        return !0;
      }
    }
    return !1;
  }();
};
axs.properties.getContrastRatioProperties = function(a) {
  if (!axs.properties.hasDirectTextDescendant(a)) {
    return null;
  }
  var b = {}, c = window.getComputedStyle(a, null), d = axs.utils.getBgColor(c, a);
  if (!d) {
    return null;
  }
  b.backgroundColor = axs.color.colorToString(d);
  var e = axs.utils.getFgColor(c, a, d);
  b.foregroundColor = axs.color.colorToString(e);
  a = axs.utils.getContrastRatioForElementWithComputedStyle(c, a);
  if (!a) {
    return null;
  }
  b.value = a.toFixed(2);
  axs.utils.isLowContrast(a, c) && (b.alert = !0);
  var f = axs.utils.isLargeFont(c) ? 3 : 4.5, c = axs.utils.isLargeFont(c) ? 4.5 : 7, g = {};
  f > a && (g.AA = f);
  c > a && (g.AAA = c);
  if (!Object.keys(g).length) {
    return b;
  }
  (d = axs.color.suggestColors(d, e, g)) && Object.keys(d).length && (b.suggestedColors = d);
  return b;
};
axs.properties.findTextAlternatives = function(a, b, c, d) {
  var e = c || !1;
  c = axs.utils.asElement(a);
  if (!c || !e && !d && axs.utils.isElementOrAncestorHidden(c)) {
    return null;
  }
  if (a.nodeType == Node.TEXT_NODE) {
    return c = {type:"text"}, c.text = a.textContent, c.lastWord = axs.properties.getLastWord(c.text), b.content = c, a.textContent;
  }
  a = null;
  e || (a = axs.properties.getTextFromAriaLabelledby(c, b));
  c.hasAttribute("aria-label") && (d = {type:"text"}, d.text = c.getAttribute("aria-label"), d.lastWord = axs.properties.getLastWord(d.text), a ? d.unused = !0 : e && axs.utils.elementIsHtmlControl(c) || (a = d.text), b.ariaLabel = d);
  c.hasAttribute("role") && "presentation" == c.getAttribute("role") || (a = axs.properties.getTextFromHostLanguageAttributes(c, b, a, e));
  if (e && axs.utils.elementIsHtmlControl(c)) {
    d = c.ownerDocument.defaultView;
    if (c instanceof d.HTMLInputElement) {
      var f = c;
      "text" == f.type && f.value && 0 < f.value.length && (b.controlValue = {text:f.value});
      "range" == f.type && (b.controlValue = {text:f.value});
    }
    c instanceof d.HTMLSelectElement && (b.controlValue = {text:c.value});
    b.controlValue && (d = b.controlValue, a ? d.unused = !0 : a = d.text);
  }
  if (e && axs.utils.elementIsAriaWidget(c)) {
    e = c.getAttribute("role");
    "textbox" == e && c.textContent && 0 < c.textContent.length && (b.controlValue = {text:c.textContent});
    if ("slider" == e || "spinbutton" == e) {
      c.hasAttribute("aria-valuetext") ? b.controlValue = {text:c.getAttribute("aria-valuetext")} : c.hasAttribute("aria-valuenow") && (b.controlValue = {value:c.getAttribute("aria-valuenow"), text:"" + c.getAttribute("aria-valuenow")});
    }
    if ("menu" == e) {
      var g = c.querySelectorAll("[role=menuitemcheckbox], [role=menuitemradio]");
      d = [];
      for (f = 0;f < g.length;f++) {
        "true" == g[f].getAttribute("aria-checked") && d.push(g[f]);
      }
      if (0 < d.length) {
        g = "";
        for (f = 0;f < d.length;f++) {
          g += axs.properties.findTextAlternatives(d[f], {}, !0), f < d.length - 1 && (g += ", ");
        }
        b.controlValue = {text:g};
      }
    }
    if ("combobox" == e || "select" == e) {
      b.controlValue = {text:"TODO"};
    }
    b.controlValue && (d = b.controlValue, a ? d.unused = !0 : a = d.text);
  }
  d = !0;
  c.hasAttribute("role") && (e = c.getAttribute("role"), (e = axs.constants.ARIA_ROLES[e]) && (!e.namefrom || 0 > e.namefrom.indexOf("contents")) && (d = !1));
  (e = axs.properties.getTextFromDescendantContent(c)) && d && (d = {type:"text"}, d.text = e, d.lastWord = axs.properties.getLastWord(d.text), a ? d.unused = !0 : a = e, b.content = d);
  c.hasAttribute("title") && (e = {type:"string", valid:!0}, e.text = c.getAttribute("title"), e.lastWord = axs.properties.getLastWord(e.lastWord), a ? e.unused = !0 : a = e.text, b.title = e);
  return 0 == Object.keys(b).length && null == a ? null : a;
};
axs.properties.getTextFromDescendantContent = function(a) {
  var b = a.childNodes;
  a = [];
  for (var c = 0;c < b.length;c++) {
    var d = axs.properties.findTextAlternatives(b[c], {}, !0);
    d && a.push(d.trim());
  }
  if (a.length) {
    b = "";
    for (c = 0;c < a.length;c++) {
      b = [b, a[c]].join(" ").trim();
    }
    return b;
  }
  return null;
};
axs.properties.getTextFromAriaLabelledby = function(a, b) {
  var c = null;
  if (!a.hasAttribute("aria-labelledby")) {
    return c;
  }
  for (var d = a.getAttribute("aria-labelledby").split(/\s+/), e = {valid:!0}, f = [], g = [], h = 0;h < d.length;h++) {
    var k = {type:"element"}, m = d[h];
    k.value = m;
    var l = document.getElementById(m);
    l ? (k.valid = !0, k.text = axs.properties.findTextAlternatives(l, {}, !0), k.lastWord = axs.properties.getLastWord(k.text), f.push(l.textContent.trim()), k.element = l) : (k.valid = !1, e.valid = !1, k.errorMessage = {messageKey:"noElementWithId", args:[m]});
    g.push(k);
  }
  0 < g.length && (g[g.length - 1].last = !0, e.values = g, e.text = f.join(" "), e.lastWord = axs.properties.getLastWord(e.text), c = e.text, b.ariaLabelledby = e);
  return c;
};
axs.properties.getTextFromHostLanguageAttributes = function(a, b, c, d) {
  if (axs.browserUtils.matchSelector(a, "img") && a.hasAttribute("alt")) {
    var e = {type:"string", valid:!0};
    e.text = a.getAttribute("alt");
    c ? e.unused = !0 : c = e.text;
    b.alt = e;
  }
  if (axs.browserUtils.matchSelector(a, 'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), video:not([disabled])') && !d) {
    if (a.hasAttribute("id")) {
      d = document.querySelectorAll('label[for="' + a.id + '"]');
      for (var e = {}, f = [], g = [], h = 0;h < d.length;h++) {
        var k = {type:"element"}, m = d[h], l = axs.properties.findTextAlternatives(m, {}, !0);
        l && 0 < l.trim().length && (k.text = l.trim(), g.push(l.trim()));
        k.element = m;
        f.push(k);
      }
      0 < f.length && (f[f.length - 1].last = !0, e.values = f, e.text = g.join(" "), e.lastWord = axs.properties.getLastWord(e.text), c ? e.unused = !0 : c = e.text, b.labelFor = e);
    }
    d = axs.utils.parentElement(a);
    for (e = {};d;) {
      if ("label" == d.tagName.toLowerCase() && (f = d, f.control == a)) {
        e.type = "element";
        e.text = axs.properties.findTextAlternatives(f, {}, !0);
        e.lastWord = axs.properties.getLastWord(e.text);
        e.element = f;
        break;
      }
      d = axs.utils.parentElement(d);
    }
    e.text && (c ? e.unused = !0 : c = e.text, b.labelWrapped = e);
    Object.keys(b).length || (b.noLabel = !0);
  }
  return c;
};
axs.properties.getLastWord = function(a) {
  if (!a) {
    return null;
  }
  var b = a.lastIndexOf(" ") + 1, c = a.length - 10;
  return a.substring(b > c ? b : c);
};
axs.properties.getTextProperties = function(a) {
  var b = {}, c = axs.properties.findTextAlternatives(a, b, !1, !0);
  if (0 == Object.keys(b).length && ((a = axs.utils.asElement(a)) && axs.browserUtils.matchSelector(a, "img") && (b.alt = {valid:!1, errorMessage:"No alt value provided"}, a = a.src, "string" == typeof a && (c = a.split("/").pop(), b.filename = {text:c})), !c)) {
    return null;
  }
  b.hasProperties = Boolean(Object.keys(b).length);
  b.computedText = c;
  b.lastWord = axs.properties.getLastWord(c);
  return b;
};
axs.properties.getAriaProperties = function(a) {
  var b = {}, c = axs.properties.getGlobalAriaProperties(a), d;
  for (d in axs.constants.ARIA_PROPERTIES) {
    var e = "aria-" + d;
    if (a.hasAttribute(e)) {
      var f = a.getAttribute(e);
      c[e] = axs.utils.getAriaPropertyValue(e, f, a);
    }
  }
  0 < Object.keys(c).length && (b.properties = axs.utils.values(c));
  f = axs.utils.getRoles(a);
  if (!f) {
    return Object.keys(b).length ? b : null;
  }
  b.roles = f;
  if (!f.valid || !f.roles) {
    return b;
  }
  for (var e = f.roles, g = 0;g < e.length;g++) {
    var h = e[g];
    if (h.details && h.details.propertiesSet) {
      for (d in h.details.propertiesSet) {
        d in c || (a.hasAttribute(d) ? (f = a.getAttribute(d), c[d] = axs.utils.getAriaPropertyValue(d, f, a), "values" in c[d] && (f = c[d].values, f[f.length - 1].isLast = !0)) : h.details.requiredPropertiesSet[d] && (c[d] = {name:d, valid:!1, reason:"Required property not set"}));
      }
    }
  }
  0 < Object.keys(c).length && (b.properties = axs.utils.values(c));
  return 0 < Object.keys(b).length ? b : null;
};
axs.properties.getGlobalAriaProperties = function(a) {
  var b = {}, c;
  for (c in axs.constants.GLOBAL_PROPERTIES) {
    if (a.hasAttribute(c)) {
      var d = a.getAttribute(c);
      b[c] = axs.utils.getAriaPropertyValue(c, d, a);
    }
  }
  return b;
};
axs.properties.getVideoProperties = function(a) {
  if (!axs.browserUtils.matchSelector(a, "video")) {
    return null;
  }
  var b = {};
  b.captionTracks = axs.properties.getTrackElements(a, "captions");
  b.descriptionTracks = axs.properties.getTrackElements(a, "descriptions");
  b.chapterTracks = axs.properties.getTrackElements(a, "chapters");
  return b;
};
axs.properties.getTrackElements = function(a, b) {
  var c = a.querySelectorAll("track[kind=" + b + "]"), d = {};
  if (!c.length) {
    return d.valid = !1, d.reason = {messageKey:"noTracksProvided", args:[[b]]}, d;
  }
  d.valid = !0;
  for (var e = [], f = 0;f < c.length;f++) {
    var g = {}, h = c[f].getAttribute("src"), k = c[f].getAttribute("srcLang"), m = c[f].getAttribute("label");
    h ? (g.valid = !0, g.src = h) : (g.valid = !1, g.reason = {messageKey:"noSrcProvided"});
    h = "";
    m && (h += m, k && (h += " "));
    k && (h += "(" + k + ")");
    "" == h && (h = "[[object Object]]");
    g.name = h;
    e.push(g);
  }
  d.values = e;
  return d;
};
axs.properties.getAllProperties = function(a) {
  var b = axs.utils.asElement(a);
  if (!b) {
    return {};
  }
  var c = {};
  c.ariaProperties = axs.properties.getAriaProperties(b);
  c.colorProperties = axs.properties.getColorProperties(b);
  c.focusProperties = axs.properties.getFocusProperties(b);
  c.textProperties = axs.properties.getTextProperties(a);
  c.videoProperties = axs.properties.getVideoProperties(b);
  return c;
};
(function() {
  function a(a) {
    if (!a) {
      return null;
    }
    var c = a.tagName;
    if (!c) {
      return null;
    }
    c = c.toUpperCase();
    c = axs.constants.TAG_TO_IMPLICIT_SEMANTIC_INFO[c];
    if (!c || !c.length) {
      return null;
    }
    for (var d = null, e = 0, f = c.length;e < f;e++) {
      var g = c[e];
      if (g.selector) {
        if (axs.browserUtils.matchSelector(a, g.selector)) {
          return g;
        }
      } else {
        d = g;
      }
    }
    return d;
  }
  axs.properties.getImplicitRole = function(b) {
    return (b = a(b)) ? b.role : "";
  };
  axs.properties.canTakeAriaAttributes = function(b) {
    return (b = a(b)) ? !b.reserved : !0;
  };
})();
axs.properties.getNativelySupportedAttributes = function(a) {
  var b = [];
  if (!a) {
    return b;
  }
  a = a.cloneNode(!1);
  for (var c = Object.keys(axs.constants.ARIA_TO_HTML_ATTRIBUTE), d = 0;d < c.length;d++) {
    var e = c[d];
    axs.constants.ARIA_TO_HTML_ATTRIBUTE[e] in a && (b[b.length] = e);
  }
  return b;
};
(function() {
  var a = {};
  axs.properties.getSelectorForRole = function(b) {
    if (!b) {
      return "";
    }
    if (a[b] && a.hasOwnProperty(b)) {
      return a[b];
    }
    var c = ['[role="' + b + '"]'];
    Object.keys(axs.constants.TAG_TO_IMPLICIT_SEMANTIC_INFO).forEach(function(a) {
      var e = axs.constants.TAG_TO_IMPLICIT_SEMANTIC_INFO[a];
      if (e && e.length) {
        for (var f = 0;f < e.length;f++) {
          var g = e[f];
          if (g.role === b) {
            if (g.selector) {
              c[c.length] = g.selector;
            } else {
              c[c.length] = a;
              break;
            }
          }
        }
      }
    });
    return a[b] = c.join(",");
  };
})();

