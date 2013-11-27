/**
 * Dates and their actions.
 */
app.controller('DateActionCtrl',
	['$scope', '$timeout', 'dateService', 'storageService', function ($scope, $timeout, dateService, storage) {

	/* Change the month. Behaviour when amount is more than 12 is undefined. */
	$scope.changeMonth = function (amount) {
		var temp = dateFromTimestamp($scope.selected);
		var month = temp.getMonth();
		$scope.selected = temp.setMonth(temp.getMonth()+amount);
		// In case we should allow more than 12 month insert this:
		// (Math.floor(Math.abs(amount) / 12)*12 +
		if ((12 + month + amount) % 12 != temp.getMonth())
			$scope.selected = temp.setDate(0);
		$scope.dates = dateService.fillMonth($scope.selected);
	}

	/* Update classes related to selected date. */
	$scope.$watch('selected', function() {
		// By using timeout we delay this function till after the DOM has updated.
		$timeout(function() { dateService.updateNearbyStyle($scope.selected) });
	});

	/* Save changes to date action values. */
	$scope.$watch('dates[selected]', function(newValue, oldValue) {
		// TODO: This stores every time selected changes between values that are not the same.
		// Can we avoid that?
		storage.save($scope.selected, newValue);
	}, true);

	$scope.$watch(dateService.getToday(), function () {
		$scope.today = dateService.getToday();
	});

	/* Initialization */
	$scope.today = dateService.getToday();
	$scope.selected = $scope.today;
	$scope.dates = {};
	$scope.dates = dateService.fillMonth($scope.selected);
}]);

/**
 * Action types available for a date.
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
	$scope.edit = function (position, type, $event) {
		if (global_toggle_edit.checked) {
			$event.preventDefault();
			$scope.$root.$broadcast('editValue', type, function (updateItems) {
				if (updateItems)
					collectionHandler.updateCollection($scope.types, updateItems, position);
				else
					collectionHandler.removeCollection($scope.types, position);
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
		/* A current user has been clicked */
		// If not logged in
			// Check if log in is remembered, then activate user.
			// If not, open login editor to log in.
		// If logged in already, open edit mode.
		if (position == $scope.activeUser) {
			$scope.$root.$broadcast('editValue', user, function (updateItems) {
				if (updateItems)
					collectionHandler.updateCollection($scope.users, updateItems, position);
				else
					collectionHandler.removeCollection($scope.users, position);
			}, position);
		}
	}

	/* Update style related to actions. */
	$scope.$watch('users', function(newValue, oldValue) {
		if (newValue.length < oldValue.length)
			$scope.activeUser = -1;
	}, true);

	/* Initialization */
	$scope.users = [];
	$scope.activeUser;

	// TODO: remove this debug insertion.
	collectionHandler.updateCollection($scope.users,
		{name: "Erik Anderberg", icon: "\ue006", background: "rgb(255, 0, 0)", email: "heyo@ey.moo", pass: "pass"});
	collectionHandler.updateCollection($scope.users,
		{name: "Camilla Bergvall", icon: "\ue004", background: "rgb(0, 255, 0)", email: "blarg@larva.now", pass: "pass"});
}]);
