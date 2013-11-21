/* Angular app baby yeah! */
var app = angular.module('theApp', []);

/**
 * Cached dom elements:
 * @global {Object} global_body
 * @global {Object} global_position_wrapper_date
 * @global {Object} global_position_wrapper_actions
 * @global {Object} global_toggle_config
 * @global {Object} global_toggle_edit
 */
var global_body = document.body;
var global_position_wrapper_date = document.getElementById("position-wrapper-date");
var global_position_wrapper_actions = document.getElementById('position-wrapper-actions');
var global_toggle_config = document.getElementById('toggle-config');
var global_toggle_edit = document.getElementById('toggle-edit');

/**
 * Cache for client storage, either localStorage or associative array.
 * @global {Object} storage Storage cache on client.
 */
var storage = (typeof(Storage) !== "undefined") ? localStorage : {};

/**
 * Dynamic style is the go to way when you want to edit css values in run-time.
 * @global {Object} dynamicStyle A stylesheet object for manipulating css rules.
 * 	This object has two added functions: insert and editRule.
 */
var dynamicStyle = (function() {
	var style = document.createElement("style");
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);

	if (!style.sheet.cssRules)
		style.sheet.cssRules = style.sheet.rules;
	if (!style.sheet.deleteRule)
		style.sheet.deleteRule = style.sheet.removeRule;
	
	/* ruleName is the css identifier, ruleValue is it's css rules. */
	style.sheet.insert = function (ruleName, ruleValue) {
		if (style.sheet.insertRule)
			style.sheet.insertRule(ruleName + "{" + ruleValue + "}", 0);
		else
			style.sheet.addRule(ruleName, ruleValue);
	}

	/* ruleName is the css identifier, ruleValue is it's css rules.
	   Note that old rules will be overwritten. */
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

/** This is used to not trigger all resizes that are sent. */
var global_timeout;