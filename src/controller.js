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

	$scope.changeSelectedDate = function () {
		$scope.selected = this.day;
	}

	/* Initialization */
	$scope.today = getStrippedTime();
	$scope.selected = $scope.today;
	$scope.fillMonth($scope.selected);
}

function Sweets($scope) {
	$scope.types = [
		{ name: "candy", icon: "icon-candy", background: 'lightgreen'},
		{ name: "cake", icon: "icon-cupcake", background: 'orange'},
		{ name: "drink", icon: "icon-drink", background: 'hotpink'},
		{ name: "icecream", icon: "icon-ian-yates-mr-whippy", background: 'powderblue'}
	];
}
