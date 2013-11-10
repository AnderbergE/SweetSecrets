/**
 * Dates and their actions.
 */
app.controller('DateActionCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
	/* Change the month. Behaviour when amount is more than 12 is undefined. */
	$scope.changeMonth = function (amount) {
		var temp = dateFromTimestamp($scope.selected);
		var month = temp.getMonth();
		$scope.selected = temp.setMonth(temp.getMonth()+amount);
		// In case we should allow more than 12 month insert this:
		// (Math.floor(Math.abs(amount) / 12)*12 +
		if ((12 + month + amount) % 12 != temp.getMonth())
			$scope.selected = temp.setDate(0);
		fillMonth($scope.selected);
	}

	/* Fill the calendar for this month. */
	function fillMonth (timestamp) {
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

	/* If today is in the month, make it show */
	function setToday () {
		var day = document.getElementById($scope.today);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " today";
		}
	}

	/* Set the nearby class to day elements */
	function updateNearby () {
		// Remove old nearby dates.
		var old = global_position_wrapper_date.querySelectorAll(".nearby");
		for (var i = 0; old && i < old.length; i++) {
			old[i].className = old[i].className.replace(" nearby", "");
		}

		// Add new nearby dates.
		var day = document.getElementById($scope.selected);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " nearby";
			var prev = day.previousSibling;
			var next = day.nextSibling;
			for (var i = 1; i <= NEARBY_DATES; i++) {
				if (prev) {
					prev.className = prev.className + " nearby";
					prev = prev.previousSibling;
				}
				if (next){
					next.className = next.className + " nearby";
					next = next.nextSibling;
				}
			}
		}

		setToday();
	}

	/* Update classes related to selected date. */
	$scope.$watch('selected', function() {
		// By using timeout we delay this function till after the DOM has updated.
		$timeout(function() { updateNearby() });
	});

	/* Save changes to date action values. */
	$scope.$watch('dates[selected]', function(newValue, oldValue) {
		// TODO: This stores every time selected changes between values that are not the same.
		// Can we avoid that?
		store($scope.selected, newValue);
	}, true);

	/* Initialization */
	var NEARBY_DATES = 3;
	$scope.today = getStrippedTime();
	$scope.selected = $scope.today;
	$scope.dates = {};
	fillMonth($scope.selected);
}]);

/**
 * Action types available for a date.
 * @param {Object} $scope Angular.js scope.
 */
app.controller('ActionTypeCtrl', ['$scope', 'collectionHandler', function ($scope, collectionHandler) {
	/* Open editor for this type */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', {}, function (updateItems) {
			updateItems.name = $scope.types.length;
			collectionHandler.updateCollection($scope.types, updateItems);
		});
	}

	/* Open editor for this type */
	$scope.edit = function (position, type) {
		if (document.getElementById("toggle-edit").checked) {
			window.event.preventDefault();
			$scope.$root.$broadcast('editValue', type, function (updateItems) {
				collectionHandler.updateCollection($scope.types, updateItems, position);
			}, position);
		}
	}

	/* Update style related to actions. */
	$scope.$watch('types', function() {
		calculateActionStyle($scope.types.length+1); // +1 Due to add-action element.
		
		var amount = $scope.types.length;
		var ruleValue = "";
		if (amount < 6) {
			ruleValue += "height:" + (100 / amount) + "%;";
			ruleValue += "width:100%;";
		} else {
			ruleValue += "height:" + (100 / Math.ceil(amount/2)) + "%;";
			ruleValue += "width:50%;";
			if (amount % 2 > 0)
				dynamicStyle.editRule('.day .action-bg:last-child', "width:100%;");
			else
				dynamicStyle.editRule('.day .action-bg:last-child', "width:50%;");
		}
		dynamicStyle.editRule('.day .action-bg', ruleValue);
	}, true);
	
	/* Initialization */
	$scope.types = [];
	
	// TODO: remove this debug insertion.
	collectionHandler.updateCollection($scope.types,
		{name: "candy", icon: "\ue006", background: "rgb(144, 238, 144)"});
	collectionHandler.updateCollection($scope.types,
		{name: "cake", icon: "\ue002", background: "rgb(255, 165, 0)"});
	collectionHandler.updateCollection($scope.types,
		{name: "drink", icon: "\ue00a", background: "rgb(255, 105, 180)"});
	collectionHandler.updateCollection($scope.types,
		{name: "icecream", icon: "\ue009", background: "rgb(176, 224, 230)"});
}]);

/**
 * Users for the app.
 * @param {Object} $scope Angular.js scope.
 */
app.controller('UserCtrl', ['$scope', 'collectionHandler', function ($scope, collectionHandler) {
	/* Open editor for this user */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', {email: true}, function (updateItems) {
			collectionHandler.updateCollection($scope.users, updateItems);
		});
	}

	/* Open editor for this user */
	$scope.edit = function (position, user) {
		if (document.getElementById("toggle-edit").checked) {
			$scope.$root.$broadcast('editValue', user, function (updateItems) {
				collectionHandler.updateCollection($scope.users, updateItems, position);
			}, position);
		}
	}

	/* Initialization */
	$scope.users = [];
	$scope.activeUser;

	// TODO: remove this debug insertion.
	collectionHandler.updateCollection($scope.users,
		{name: "Erik Anderberg", icon: "\ue006", background: "rgb(255, 0, 0)", email: "heyo@ey.moo", pass: "pass"});
	collectionHandler.updateCollection($scope.users,
		{name: "Camilla Bergvall", icon: "\ue004", background: "rgb(0, 255, 0)", email: "blarg@larva.now", pass: "pass"});
}]);