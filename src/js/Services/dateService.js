/**
 * A service to handle date functionality.
 */
app.service('dateService',
	['$timeout',
	function ($timeout) {

	this.getToday = function () {
		return today;
	}

	/*
	 * Set the nearby class to day elements.
	 * @param {number} selected The day (in ms) that is selected.
	 */
	this.updateNearbyStyle = function (selected) {
		// Remove old nearby dates.
		angular.element(global_position_wrapper_date.querySelectorAll(".nearby")).removeClass('nearby');

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
		angular.element(global_position_wrapper_date.querySelectorAll(".today")).removeClass('today');

		angular.element(document.getElementById(today)).parent().addClass('today');
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
}]);
