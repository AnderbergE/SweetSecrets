/** @global One day in ms. */
var A_DAY_IN_MS = 86400000;

/**
 * Returns a Date object from a timestamp.
 * @param {Number|Date} timestamp Ms from epoch or Date object.
 * @returns {Date} The timestamp as a Date object.
 */
function dateFromTimestamp(timestamp) {
	var date = timestamp;
	if (! timestamp) {
		date = new Date();
	} else if (! (timestamp instanceof Date)) { 
		date = new Date(timestamp);
	}
	return date;
}

/**
 * Returns the last day in the month.
 * @param {Number|Date} date Ms from epoch or Date object.
 * @returns {Date} The last day in the month of the value supplied.
 */
function getLastDayInMonth(date) {
	date = dateFromTimestamp(date);
	return new Date(date.getFullYear(), date.getMonth()+1, 0);
}

/**
 * Strips a date value from its time part and return ms from epoch.
 * @param {Number|Date} date Ms from epoch or Date object.
 * @returns {Number} Ms from epoch of supplied date.
 */
function getStrippedTime(date) {
	date = dateFromTimestamp(date);
	date.setHours(0,0,0,0);
	return date.getTime();
}
