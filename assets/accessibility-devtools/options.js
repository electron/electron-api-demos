// Copyright 2013 Google Inc.
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

(function(document) {
    function writeAuditRulePref(auditRuleName, enabled) {
        chrome.storage.sync.get('auditRules', function gotRules(items) {
            var storedPrefs = items['auditRules'];
            storedPrefs[auditRuleName] = enabled;
            chrome.storage.sync.set({ 'auditRules': storedPrefs });
        });
    }

    function writeAuditRulePrefs(prefs) {
        chrome.storage.sync.get('auditRules', function gotRules(items) {
            var storedPrefs = items['auditRules'];
            for (var auditRuleName in prefs)
                storedPrefs[auditRuleName] = prefs[auditRuleName];
            chrome.storage.sync.set({ 'auditRules': storedPrefs });
        });
    }

    function writeCheckboxes(prefs) {
        if (!('auditRules' in prefs))
            var auditRulePrefs = {};
        else
            var auditRulePrefs = prefs['auditRules'];
        var list = document.querySelector('#audit-rules');
        list.innerHTML = "";
        var allChecked = true;
        var auditRuleNames = axs.AuditRules.getRules(true);
        for (var i = 0; i < auditRuleNames.length; i++) {
            var auditRuleName = auditRuleNames[i];
            if (!(auditRuleName in auditRulePrefs)) {
                // When no pref, default to on
                auditRulePrefs[auditRuleName] = true;
            }
            if (!auditRulePrefs[auditRuleName])
                allChecked = false;
            var auditRule = axs.ExtensionAuditRules.getRule(auditRuleName);
            var heading = auditRule.heading;
            var div = document.createElement('div');
            div.className = 'checkbox';
            list.appendChild(div);
            var label = document.createElement('label');
            div.appendChild(label);
            var input = document.createElement('input');
            input.id = auditRuleName + '-enabled';
            input.type = 'checkbox';
            label.appendChild(input);
            input.checked = auditRulePrefs[auditRuleName];
            input.addEventListener('click', function(e) {
                var ruleName = e.target.id.split('-')[0];
                writeAuditRulePref(ruleName,
                          e.target.checked);
            });
            var span = document.createElement('span');
            span.textContent = heading;
            span.htmlFor = input.id;
            label.appendChild(span);
        }
        if (allChecked)
            document.getElementById('reset-audit-rules').checked = true;
        chrome.storage.sync.set({'auditRules': auditRulePrefs});
    }

    function getPrefs() {
        chrome.storage.sync.get('auditRules', function gotRules(items) {
            writeCheckboxes(items);
        });
    }

    getPrefs();

    function toggleSelectAll(e) {
        var on = e.target.checked;
        var auditRulePrefs = {};
        var auditRuleNames = axs.AuditRules.getRules(true);
        for (var i = 0; i < auditRuleNames.length; i++) {
            var auditRuleName = auditRuleNames[i];
            document.getElementById(auditRuleName + '-enabled').checked = on;
            auditRulePrefs[auditRuleName] = on;
        }
        writeAuditRulePrefs(auditRulePrefs);
    }
    document.getElementById('reset-audit-rules').addEventListener('click',
                                                                  toggleSelectAll);
})(document);
