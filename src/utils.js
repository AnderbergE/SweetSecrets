var A_DAY_IN_MS = 86400000;

function dateToYMD(date) {
	var d = date.getDate();
	var m = date.getMonth() + 1;
	var y = date.getFullYear();
	return dateFillZeroes(y, m, d);
}

function dateFillZeroes(y, m, d) {
	return '' + y + (m<=9 ? '0' + m : m) + (d <= 9 ? '0' + d : d);
}

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
