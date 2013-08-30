/** @global One day in ms. */
var A_DAY_IN_MS = 86400000;

/* Initialise storage, use local storage, otherwise associative array. */
var STORAGE;
if (typeof(Storage) !== "undefined") { STORAGE = localStorage; }
else { STORAGE = new Object(); }

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
		date = new Date(parseInt(timestamp));
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

/**
 * Store an object in local storage (or browser cache).
 * @param {Object} an associative array with times from epoch.
 */
function store(obj) {
	for (var time in obj) {
		STORAGE[time] = JSON.stringify(obj[time]);
	}
}

/**
 * Retrieve an object from local storage.
 * @returns {Object} An associative array, with stored value or empty.
 */
function retrieve(time) {
	if (STORAGE[time])
		return JSON.parse(STORAGE[time]);
	return {};
}
