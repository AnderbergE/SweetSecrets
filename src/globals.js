/* Cached dom elements */
var global_body = document.body;
var global_position_wrapper_date = document.getElementById("position-wrapper-date");
var global_position_wrapper_actions = document.getElementById('position-wrapper-actions');
var global_toggle_edit = document.querySelector('#toggle-edit');

/* Initialise storage, use local storage, otherwise associative array. */
/** @global STORAGE - storage cache on client, localStorage or an object. */
var STORAGE;
if (typeof(Storage) !== "undefined")
	STORAGE = localStorage;
else
	STORAGE = {};

var dynamicStyle = (function() {
	var style = document.createElement("style");
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);

	style.sheet.insert = function (name, value) {
		if (style.sheet.insertRule)
			style.sheet.insertRule(name + "{" + value + "}", 0);
		else
			style.sheet.addRule(ruleName, ruleValue);
	}

	if (!style.sheet.cssRules)
		style.sheet.cssRules = style.sheet.rules;
	if (!style.sheet.deleteRule)
		style.sheet.deleteRule = style.sheet.removeRule;

	style.sheet.editRule = function (ruleName, ruleValue) {
		var ruleExist = false;
		for (var i = 0; i < style.sheet.cssRules.length; i++) {
			if (style.sheet.cssRules[i].selectorText == ruleName) {
				style.sheet.deleteRule(i);
				style.sheet.insert(ruleName, ruleValue);
				ruleExist = true;
			}
		}
		if (!ruleExist)
			style.sheet.insert(ruleName, ruleValue);
	}

	return style.sheet;
})();
