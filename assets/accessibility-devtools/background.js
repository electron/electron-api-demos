// Map of tabId to either a callback or an empty object.
var inspectedTabs = {};

// Map of tabId to a token indicating which iteration of content script injection is current.
var contentScriptTokens = {};

function injectContentScript(tabId, remaining_scripts, token) {
    // If a new round of injecting has started, bail out of this one.
    if (token != contentScriptTokens[tabId]) {
        return;
    }
    var script = remaining_scripts.shift();
    chrome.tabs.executeScript(
        tabId,
        { file: script, allFrames: true }, // Would be nice if we could specify a frame id here
        function() {
            if (chrome.extension.lastError) {
                if ('callback' in inspectedTabs[tabId]) {
                    var callback = inspectedTabs[tabId].callback;
                    callback({ error: chrome.extension.lastError.message });
                    delete inspectedTabs[tabId].callback;
                }
                return;
            }
            if (remaining_scripts.length) {
                injectContentScript(tabId, remaining_scripts, token);
            } else if ('callback' in inspectedTabs[tabId]) {
                var callback = inspectedTabs[tabId].callback;
                callback({ success: true });
                delete inspectedTabs[tabId].callback;
            }
        });
};

function injectContentScripts(tabId) {
    if (tabId in contentScriptTokens) {
        contentScriptTokens[tabId]++;
    } else {
        contentScriptTokens[tabId] = 0;
    }
    var token = contentScriptTokens[tabId];
    var scripts = [ 'generated/axs.js',
                    'generated/constants.js',
                    'generated/utils.js',
                    'generated/properties.js',
                    'generated/audits.js',
                    'generated/extension_properties.js',
                    'generated/extension_audits.js' ]
    injectContentScript(tabId, scripts, token);
}

chrome.extension.onRequest.addListener(
    function(request, sender, callback) {
        switch(request.command) {
        case 'injectContentScripts':
            var tabId = request.tabId;
            var topFrameLoaded = true;
            if (!(tabId in inspectedTabs)) {
                var beforeNavigateCallback = function(details) {
                    if (details.tabId == tabId && details.frameId == 0) {
                        topFrameLoaded = false;
                    }
                }
                chrome.webNavigation.onBeforeNavigate.addListener(beforeNavigateCallback);
                var completedCallback = function(details) {
                    if (details.tabId != tabId)
                        return;
                    if (details.frameId == 0) {
                        // When the top frame completes loading, inject content scripts into all
                        // frames. Copy the list of all frames seen so far into |framesInjected|
                        injectContentScripts(tabId);
                        topFrameLoaded = true;
                    } else if (topFrameLoaded) {
                        // If a frame completes loading after the top frame, we need to inject
                        // content scripts into all frames again, so that we catch this one.
                        injectContentScripts(tabId);
                    }
                };
                chrome.webNavigation.onCompleted.addListener(completedCallback);

                chrome.tabs.onRemoved.addListener(function(removedTabId) {
                    if (removedTabId != tabId)
                        return;

                    chrome.webNavigation.onBeforeNavigate.removeListener(beforeNavigateCallback);
                    chrome.webNavigation.onCompleted.removeListener(completedCallback);
                    delete inspectedTabs[tabId];
                    delete contentScriptTokens[tabId];
                });
            }
            // Store the callback so we can call it when all scripts have been injected into all
            // frames.
            inspectedTabs[tabId] = { callback: callback };
            injectContentScripts(tabId);
            return;
        case 'getAuditPrefs':
            chrome.storage.sync.get('auditRules', callback);
            return;
        }
});
