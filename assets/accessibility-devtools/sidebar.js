// Copyright 2012 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function updateView(result) {
    if (!result) {
        console.warn('no result');
        result = {};
    }
    if (typeof result != 'object') {
        console.warn('non-object result:', result);
        return;
    }
    console.log('result', result);

    var main = document.getElementById('main');
    main.innerHTML = '';
    var foundProperty = false;

    for (var sectionName in result) {
        var section = result[sectionName];
        if (!section)
            continue;

        try {
            var template = new Handlebar(getTemplate(sectionName));
            template.render(section,
                            { 'heading': chrome.i18n.getMessage(sectionName),
                              'ariaPartial': new Handlebar(getTemplate('ariaProperty'))
                            }).appendTo(main);
            foundProperty = true;
        } catch (ex) {
            console.error('Could not render results section', section, ex.toString(), ex.stack);
        }

        if (sectionName == 'colorProperties' && 'contrastRatio' in section &&
            'suggestedColors' in section['contrastRatio'])
            insertStyleChangeEventListeners(section);
    }

    if (!foundProperty) {
        var empty = new Handlebar(getTemplate('empty'));
        empty.render({ 'noAccessibilityInformation': chrome.i18n.getMessage('noAccessibilityInformation') }).appendTo(main);
    }
    insertMessages();
    insertIdrefEventListeners();
    insertElementRefEventListeners();
    updateHeight();
}

function getTemplate(template) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('templates/' + template + '.html'), false);
    xhr.send();
    return xhr.responseText;
}

function updateHeight() {
    var styleHeightPx = window.getComputedStyle(document.body).height;
    var matches = styleHeightPx.match(/((\d+)(\.\d+)?)px/);
    var styleHeight = parseInt(matches[1]);
    var calculatedScrollHeight = styleHeight + 5; // not sure why 5 but it works

    window.sidebar.setHeight(calculatedScrollHeight + "px");
}

function insertElementRefEventListeners() {
    var elementsWithElementRef = document.querySelectorAll('[element]');
    for (var i = 0; i < elementsWithElementRef.length; i++) {
        var element = elementsWithElementRef[i];
        var elementRef = element.getAttribute('element');
        addElementRefEventListener(element, elementRef);
    }
}

function addElementRefEventListener(element, elementRef) {
    element.addEventListener('click',
                             function() {
        var toEval = 'var node = axs.content.getSidebarNode("' + elementRef + '");\n' +
                      'inspect(node);';
        if (window.sidebar.contentScriptInjected) {
            chrome.devtools.inspectedWindow.eval(
                toEval, { useContentScriptContext: true });
        } else {
            chrome.devtools.inspectedWindow.eval(toEval);
        }
    });
}

function insertIdrefEventListeners() {
    var elementsWithIdref = document.querySelectorAll('[idref]');
    for (var i = 0; i < elementsWithIdref.length; i++) {
        var element = elementsWithIdref[i];
        var idref = element.getAttribute('idref');
        addIdRefEventListener(element, idref);
    }
}

function addIdRefEventListener(element, idref) {
    element.addEventListener('click',
                             function() {
        chrome.devtools.inspectedWindow.eval(
            'var element = document.getElementById("' + idref + '");\n' +
            'if (element) inspect(element);'
        );
    });
}

function insertNodeIdEventListeners() {
    var elementsWithNodeId = document.querySelectorAll('[nodeId]');
    for (var i = 0; i < elementsWithNodeId.length; i++) {
        var element = elementsWithNodeId[i];
        var nodeId = element.getAttribute('nodeId');
        addNodeIdEventListener(element, nodeId);
    }
}

function addNodeIdEventListener(element, nodeId) {
    element.addEventListener('click', function() {
        var toEval = 'var element = axs.content.getResultNode("' + nodeId +
            '");\n' +
            'if (element) inspect(element);';
        if (window.sidebar.contentScriptInjected) {
            chrome.devtools.inspectedWindow.eval(
                toEval, { useContentScriptContext: true });
        } else {
            chrome.devtools.inspectedWindow.eval(toEval);
        }
    });
}

function insertStyleChangeEventListeners(colorProperties) {
    var existingColorsEl = document.querySelector('#contrast-ratio > .bevel-border');
    var contrastProperties = colorProperties['contrastRatio']
    if (!contrastProperties)
        return;
    if (existingColorsEl) {
        addStyleChangeEventListener(existingColorsEl,
                                    contrastProperties['foregroundColor'],
                                    contrastProperties['backgroundColor']);
    }
    var suggestedAAEl = document.querySelector('#suggested-colors-AA > .bevel-border');
    var suggestedColors = contrastProperties['suggestedColors'];
    if (!suggestedColors)
        return;
    if (suggestedAAEl) {
        addStyleChangeEventListener(suggestedAAEl,
                                    suggestedColors['AA']['fg'],
                                    suggestedColors['AA']['bg']);
    }
    var suggestedAAAEl = document.querySelector('#suggested-colors-AAA > .bevel-border');
    if (suggestedAAAEl) {
        addStyleChangeEventListener(suggestedAAAEl,
                                    suggestedColors['AAA']['fg'],
                                    suggestedColors['AAA']['bg']);
    }
}

function addStyleChangeEventListener(element, fgColor, bgColor) {
    element.addEventListener('click', function() {
        applyColors(fgColor, bgColor);
    });
}

function applyColors(foreground, background) {
    var changeColor = '(function() {\n'
        + '$0.style.color = "' + foreground + '";\n'
        + '$0.style.background = "' + background + '";\n'
        + '$0.style.opacity = "1";\n'
        + '})();';
    chrome.devtools.inspectedWindow.eval(changeColor);
}

function gotBaseURI(result) {
    if (!result)
        return;
    if (window.sidebar.contentScriptInjected) {
        chrome.devtools.inspectedWindow.eval(
            'axs.extensionProperties.getAllProperties($0);',
            { useContentScriptContext: true,
              frameURL: axs.content.removeFragment(result) },
            updateView);
    } else {
        chrome.devtools.inspectedWindow.eval(
            'axs.extensionProperties.getAllProperties($0);',
            { frameURL: axs.content.removeFragment(result) },
            updateView);
    }
}

function onURLsRetrieved(result) {
    var urls = Object.keys(result);
    for (var i = 0; i < urls.length; i++) {
        chrome.devtools.inspectedWindow.eval(
            '$0.ownerDocument.documentURI;',
            { frameURL: urls[i] },
            gotBaseURI);
    }
}

function onSelectionChanged() {
    if (!window.sidebar)
        return;

    if (window.sidebar.contentScriptInjected) {
        chrome.devtools.inspectedWindow.eval(
            'axs.content.frameURIs;',
            { useContentScriptContext: true },
            onURLsRetrieved);
    } else {
        chrome.devtools.inspectedWindow.eval(
            window.sidebar.allScripts + 'axs.content.frameURIs;',
            {},
            onURLsRetrieved);
    }
}

function insertMessages() {
    var nodesWithMsg = document.querySelectorAll('[msg]');
    for (var i = 0; i < nodesWithMsg.length; i++) {
        var node = nodesWithMsg[i];
        node.innerText = chrome.i18n.getMessage(node.getAttribute('msg'));
    }
}

chrome.devtools.panels.elements.onSelectionChanged.addListener(onSelectionChanged);
insertMessages();
