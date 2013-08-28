/**
 * Dates and their actions.
 * @param {Object} $scope Angular.js scope.
 */
function SweetDates($scope) {
	/* Fill the calendar for this month. */
	$scope.fillMonth = function (timestamp) {
		if (! $scope.dates) $scope.dates = {};
		var start = (new Date(timestamp)).setDate(1);
		var end = getStrippedTime(getLastDayInMonth(timestamp));
		for (var i = start; i <= end; i += A_DAY_IN_MS) {
			$scope.dates[i] = {};
		}
	}

	/* Event trigger when changing dates. */
	$scope.changeSelectedDate = function () {
		$scope.selected = this.day;
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
