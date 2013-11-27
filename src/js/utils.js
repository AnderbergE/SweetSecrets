/**
 * Returns a Date object from a timestamp.
 * @param {Number|Date} timestamp Ms from epoch or Date object.
 * @returns {Date} The timestamp as a Date object.
 */
function dateFromTimestamp (timestamp) {
	if (! timestamp)
		return new Date();
	else if (! (timestamp instanceof Date))
		return new Date(parseInt(timestamp));
}

/**
 * Returns the last day in the month.
 * @param {Number|Date} date Ms from epoch or Date object.
 * @returns {Date} The last day in the month of the value supplied.
 */
function getLastDayInMonth (date) {
	date = dateFromTimestamp(date);
	return new Date(date.getFullYear(), date.getMonth()+1, 0);
}

/**
 * Strips a date value from its time part and return ms from epoch.
 * @param {Number|Date} date Ms from epoch or Date object.
 * @returns {Number} Ms from epoch of supplied date.
 */
function getStrippedTime (date) {
	date = dateFromTimestamp(date);
	return date.setHours(0,0,0,0);
}

/**
 * Friendly way to add an event listener.
 * @param {Object} element The element to add listener to.
 * @param {string} trigger The name of the trigger (such as 'click').
 * @param {Object} runFunction What function to run when event is triggered.
 */
function addEvent(element, trigger, runFunction){
	if (element.attachEvent)
		return element.attachEvent('on'+trigger, runFunction);
	else
		return element.addEventListener(trigger, runFunction, false);
}

/**
 * Friendly way to remove an event listener.
 * @param {Object} element The element to remove a listener from.
 * @param {string} trigger The name of the trigger (such as 'click').
 * @param {Object} runFunction The function to remove from the listeners.
 */
function removeEvent(element, trigger, runFunction){
	if (element.detachEvent)
		return element.detachEvent('on'+trigger, runFunction);
	else
		return element.removeEventListener(trigger, runFunction);
}
