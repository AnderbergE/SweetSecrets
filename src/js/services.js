/**
 * A service to handle collection functions of users and actions.
 */
app.service('collectionHandler', function () {
	/* Update an existing collection (position -1 will add a user) */
	this.updateCollection = function (collection, updateItems, position) {
		// TODO: Error checking and server check.
		if (position == null || position < 0)
			collection.push(updateItems);
		else {
			for (item in updateItems) {
				collection[position][item] = updateItems[item];
			}
		}
	}
	
	/* Remove something from a collection */
	this.removeCollection = function (collection, position) {
		// TODO: Error checking and server check.
		collection.splice(position, 1);
	}
});

/**
 * A service to handle date functionality.
 */
app.service('dateService', function ($timeout) {
	this.getToday = function () {
		return today;
	}

	/* Fill the calendar for this month. */
	this.fillMonth = function (timestamp) {
		var dates = {};
		var end = (getLastDayInMonth(timestamp)).getDate();
		var date = new Date(timestamp);
		var temp;
		for (var i = 1; i <= end; i++) {
			date.setDate(i);
			temp = date.setHours(0,0,0,0);
			dates[temp] = retrieve(temp);
		}
		return dates;
	}

	/* Set the nearby class to day elements */
	this.updateNearbyStyle = function (selected) {
		// Remove old nearby dates.
		var old = global_position_wrapper_date.querySelectorAll(".nearby");
		for (var i = 0; old && i < old.length; i++) {
			old[i].className = old[i].className.replace(" nearby", "");
		}

		// Add new nearby dates.
		var day = document.getElementById(selected);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " nearby";
			var prev = day.previousElementSibling;
			var next = day.nextElementSibling;
			for (var i = 1; i <= NEARBY_DATES; i++) {
				if (prev) {
					prev.className = prev.className + " nearby";
					prev = prev.previousElementSibling;
				}
				if (next){
					next.className = next.className + " nearby";
					next = next.nextElementSibling;
				}
			}
		}

		setTodayStyle();
	}

	/* If today is in the month, make it show */
	function setTodayStyle () {
		var old = global_position_wrapper_date.querySelectorAll(".today");
		for (var i = 0; old && i < old.length; i++) {
			old[i].className = old[i].className.replace(" today", "");
		}

		var day = document.getElementById(today);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " today";
		}
	}

	/* Make sure that "today" is actually today */
	function updateTodayTimer () {
		today = getStrippedTime();
		setTodayStyle();
		$timeout(updateTodayTimer, (new Date()).setHours(24,0,0,0) - (new Date()).getTime());
	}

	var NEARBY_DATES = 3;
	var today;
	updateTodayTimer();
});