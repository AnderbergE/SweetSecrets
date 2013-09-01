/**
 * Dates and their actions.
 * @param {Object} $scope Angular.js scope.
 */
function SweetDates($scope) {
	/* Fill the calendar for this month. */
	$scope.fillMonth = function (timestamp) {
		$scope.dates = {};
		var end = (getLastDayInMonth(timestamp)).getDate();
		var date = new Date(timestamp);
		var temp;
		for (var i = 1; i <= end; i++) {
			date.setDate(i);
			temp = date.setHours(0,0,0,0);
			$scope.dates[temp] = retrieve(temp);
		}
	}

	/* Event trigger when changing dates. */
	$scope.changeSelectedDate = function () {
		$scope.selected = this.day;
	}
	
	/* Change the month. Behaviour when amount is more than 12 is undefined. */
	$scope.changeMonth = function (amount) {
		// TODO: This storing is not enough, we should store on all changes.
		store($scope.dates);
		var temp = dateFromTimestamp($scope.selected);
		var month = temp.getMonth();
		$scope.selected = temp.setMonth(temp.getMonth()+amount);
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
