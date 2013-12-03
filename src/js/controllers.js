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
app.controller('ActionTypeCtrl', ['$scope', 'storageService', function ($scope, storage) {
	/* Open editor for this type */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', {}, function (updatedItem) {
			updatedItem.name = $scope.types.length;
			updateType(updatedItem);
		});
	}

	/* Open editor for this type */
	$scope.edit = function ($event, type) {
		if (global_toggle_edit.checked) {
			$event.preventDefault();
			$scope.$root.$broadcast('editValue', type, function (updatedItem) {
				if (updatedItem)
					updateType(updatedItem);
				else
					removeType(type);
			});
		}
	}

	/* Update style related to actions. */
	$scope.$watch('types', function() {
		calculateActionStyle($scope.types.length+1); // +1 Due to add-action element.
		
		var amount = $scope.types.length;
		var ruleValue = "";
		dynamicStyle.editRule('.day .action-bg:last-child', null);
		if (amount < 6) {
			ruleValue += "height:" + (100 / amount) + "%;";
			ruleValue += "width:100%;";
		} else {
			ruleValue += "height:" + (100 / Math.ceil(amount/2)) + "%;";
			ruleValue += "width:50%;";
			if (amount % 2 == 0)
				dynamicStyle.editRule('.day .action-bg:last-child', "width:50%;");
		}
		dynamicStyle.editRule('.day .action-bg', ruleValue);
	}, true);
	
	/* */
	function updateType (item) {
		var index = $scope.types.indexOf(item);
		if (index < 0)
			$scope.types.push(item);
		else
			angular.extend($scope.types[index], item);
	}
	
	/* */
	function removeType (item) {
		var index = $scope.types.indexOf(item);
		if (index >= 0)
			$scope.types.splice(index, 1);
	}

	/* Initialization */
	storage.bind($scope, 'types', { defaultValue: [] });

	// TODO: remove this debug insertion.
	if ($scope.types.length <= 0) {
		updateType({name: "candy", icon: "\ue006", background: "rgb(144, 238, 144)"});
		updateType({name: "cake", icon: "\ue002", background: "rgb(255, 165, 0)"});
		updateType({name: "drink", icon: "\ue00a", background: "rgb(255, 105, 180)"});
		updateType({name: "icecream", icon: "\ue009", background: "rgb(176, 224, 230)"});
	}
}]);

/**
 * Users for the app.
 */
app.controller('UserCtrl', ['$scope', 'userService', function ($scope, userService) {
	/* Open editor for this user */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', {email: true}, function (updateItems) {
			userService.updateUser(updateItems);
		});
	}

	/* Open editor for this user */
	$scope.edit = function ($event, user) {
		var active = userService.getActiveUser();
		if (user != active) {
			// Check if log in is remembered, then activate user.
			// If not, open login editor to log in.
			if (!userService.login(user))
				$event.preventDefault();
		}
		if (user == active || global_toggle_edit.checked) {
			$scope.$root.$broadcast('editValue', user, function (updatedUser) {
				if (updatedUser)
					userService.updateUser(updatedUser);
				else
					userService.removeUser(user);
			});
		}
	}

	/* Log out the current user when signal is received */
	$scope.$on('logout', function() {
		userService.logout();
	});
	
	/* Set the index of the active user when it changes. */
	$scope.$watch(userService.getActiveUser(), function () {
		var active = userService.getActiveUser();
		var index = $scope.users.indexOf(active);
		/* Storage does not save index in array, try to find it manually */
		if (index < 0) {
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].email == active.email) {
					index = i;
					break;
				}	
			}
		}
		$scope.activeUserIndex = index;
	});

	/* Initialization */
	$scope.users = userService.getUsers();
	$scope.activeUserIndex = -1;

	// TODO: remove this debug insertion.
	if ($scope.users.length <= 0) {
		userService.updateUser({name: "Erik Anderberg", icon: "\ue006",
			 background: "rgb(255, 0, 0)", email: "heyo@ey.moo", pass: "pass"});
		userService.updateUser({name: "Camilla Bergvall", icon: "\ue004",
			 background: "rgb(0, 255, 0)", email: "blarg@larva.now", pass: "pass"});
	}
}]);
