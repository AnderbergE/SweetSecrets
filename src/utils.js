var A_DAY_IN_MS = 86400000;

function getLastDayInMonth(value) {
	value = new Date(value);
	return new Date(value.getFullYear(), value.getMonth()+1, 0);
}

/* This function strips the supplied date value from time and returns ms */
function getStrippedTime(value) {
	if (! value) {
		value = new Date();
	} else if (! (value instanceof Date)) { 
		value = new Date(value);
	}
	value.setHours(0,0,0,0);
	return value.getTime();
}
