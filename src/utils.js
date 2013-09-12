/* Initialise storage, use local storage, otherwise associative array. */
/** @global STORAGE - storage cache on client, localStorage or an object. */
var STORAGE;
if (typeof(Storage) !== "undefined")
	STORAGE = localStorage;
else
	STORAGE = {};


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
	return date.setHours(0,0,0,0);
}

/**
 * Store a key in local storage (or browser cache) with a specific value.
 * @param {number|string|Object} key.
 * @param {number|string|Object} value.
 * @throws Error if key or value is not specified.
 */
function store(key, value) {
	// TODO: Server storing.
	if (!key || !value) {
		throw "Incorrect usage of store(key, value)";
	}
	STORAGE[JSON.stringify(key)] = JSON.stringify(value);
}

/**
 * Store an array in local storage (or browser cache), overwrites current values.
 * @param {Array|Object} obj,
 *	if array, it will be stored as [index] = value,
 *	if associative array it will be stored as [key] = value.
 * @throws Error if any key does not have a value.
 */
function storeArray(obj) {
	for (var key in obj) {
		store(parseInt(key), obj[key]);
	}
}

/**
 * Retrieve a value of a specific key from local storage (or browser cache).
 * @param {number|string|Object} key.
 * @param {number|string|Object} ifEmpty What to return if key does not exist,
 *	default value {}.
 * @returns {number|string|Object} The value in storage, or ifEmpty.
 */
function retrieve(key, ifEmpty) {
	// TODO: Server retrieving.
	ifEmpty = ifEmpty || {};
	key = JSON.parse(key);
	if (STORAGE[key])
		return JSON.parse(STORAGE[key]);
	return ifEmpty;
}
