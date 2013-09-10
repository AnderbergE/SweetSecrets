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
		storeArray($scope.dates);
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
		var start = dateFromTimestamp($scope.selected);
		start.setDate(start.getDate()-3);
		var end = dateFromTimestamp($scope.selected);
		end.setDate(end.getDate()+3);
		return day >= start.setHours(0,0,0,0) &&
			day <= end.setHours(0,0,0,0);
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
	/* Add a new action */
	$scope.addAction = function(name, icon, background) {
		// TODO: This should be checked on server.
		/* Check if values exist. */
		name = name || "generic";
		icon = icon || "\ue001";
		background = background || "green";
		
		$scope.types.push({name: name, icon: icon, background: background});
	}

	/* Update an existing action */
	$scope.updateAction = function(position, name, icon, background) {
		// TODO: Error checking and server check.
		$scope.types[position] = {name: name, icon: icon, background: background}
	}
	
	/* Remove an action */
	$scope.removeAction = function(position) {
		$scope.splice(position, 1);
	}
	
	/* Initialization */
	$scope.types = [];
	
	// TODO: remove this debug insertion.
	$scope.addAction("candy", "\uf42d", "lightgreen");
	$scope.addAction("cake", "\uf35b", "orange");
	$scope.addAction("drink", "\ue001", "hotpink");
	$scope.addAction("icecream", "\ue000", "powderblue");
}

/**
 * Actions available for a date.
 * @param {Object} $scope Angular.js scope.
 */
function Users($scope) {

	/* Initialization */
	$scope.users = {};

	// TODO: remove this debug insertion.
	$scope.users["Erik"] = {name: "Erik Anderberg", background: "beige", icon: "\ue000"};
	$scope.users["Camilla"] = {name: "Camilla Bergvall", background: "lime", icon: "\uf42d"};
}
