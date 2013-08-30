/**
 * Dates and their actions.
 * @param {Object} $scope Angular.js scope.
 */
function SweetDates($scope) {
	/* Fill the calendar for this month. */
	$scope.fillMonth = function (timestamp) {
		// TODO: Local storage the dates and update from server.
		// TODO: Daylight savings time screws things up. See in October.
		$scope.dates = {};
		var start = (new Date(timestamp)).setDate(1);
		var end = getStrippedTime(getLastDayInMonth(timestamp));
		for (var i = start; i <= end; i += A_DAY_IN_MS) {
			$scope.dates[i] = retrieve(i);
		}
	}

	/* Event trigger when changing dates. */
	$scope.changeSelectedDate = function () {
		$scope.selected = this.day;
	}
	
	/* Change the month. Behaviour when amount is more than 12 is undefined. */
	$scope.changeMonth = function (amount) {
		var temp = dateFromTimestamp($scope.selected);
		store($scope.dates);
		var month = temp.getMonth();
		$scope.selected = temp.setMonth(temp.getMonth()+amount);
		temp = dateFromTimestamp($scope.selected);
		// In case we should allow more than 12 month insert this:
		// (Math.floor(Math.abs(amount) / 12)*12 +
		if ((12 + month + amount) % 12 != temp.getMonth())
			$scope.selected = temp.setDate(0);
		$scope.fillMonth($scope.selected);
	}
	
	/* Returns true if the date is within 3 days of the selected date. */
	$scope.nearbyDate = function (day) {
		return day >= ($scope.selected - A_DAY_IN_MS*3) &&
			day <= (A_DAY_IN_MS*3 + parseInt($scope.selected));
	}

	/* Initialization */
	$scope.today = getStrippedTime();
	$scope.selected = $scope.today;
	$scope.fillMonth($scope.selected);
}

/**
 * Actions available for a date.
 * @param {Object} $scope Angular.js scope.
 */
function Sweets($scope) {
	$scope.types = [
		{ name: "candy", icon: "\uf42d", background: 'lightgreen'},
		{ name: "cake", icon: "\uf35b", background: 'orange'},
		{ name: "drink", icon: "\ue001", background: 'hotpink'},
		{ name: "icecream", icon: "\ue000", background: 'powderblue'}
	];
}
