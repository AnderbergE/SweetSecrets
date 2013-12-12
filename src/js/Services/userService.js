/**
 * A service to handle users.
 */
app.service('userService',
	['$rootScope', '$http', 'storageService',
	function ($rootScope, $http, storage) {

	/* Get the current users. */
	this.getUsers = function () {
		return $scope.users;
	}

	/* Get the active user. */
	this.getActiveUser = function () {
		return $scope.activeUser;
	}

	/*
	 * Update a user.
	 * @param {Object} user The user to update.
	 */
	this.updateUser = function (user) {
		var index = $scope.users.indexOf(user);
		if (index < 0) {
			// TODO: This id should be set by server.
			user.id = Math.floor((Math.random()*10000000)+1);
			$scope.users.push(user);
		} else
			angular.extend($scope.users[index], user);
	}

	/*
	 * Remove a user. The user is logged out if currently logged in.
	 * @param {Object} user The user to remove.
	 */
	this.removeUser = function (user) {
		// TODO: Error checking and server check.
		var index = $scope.users.indexOf(user);
		if (index >= 0)
			$scope.users.splice(index, 1);
		if ($scope.users.indexOf(this.getActiveUser()) < 0)
			this.logout();
	}

	/*
	 * Log in a user.
	 * @param {Object} user The user to log in.
	 */
	this.login = function (user) {
		$scope.activeUser = user;
		$rootScope.$broadcast('login');
		return true;
	}

	/* Log out current user. */
	this.logout = function () {
		$scope.activeUser = null;
		$rootScope.$broadcast('logout');
	}

	/* We need to create a scope for the service so that we can bind to it. */
	var $scope = $rootScope.$new();
	storage.bind($scope, 'users', { defaultValue: [] });
	storage.bind($scope, 'activeUser', { defaultValue: null });

	/* Storage does not save array index, try to find it manually */
	if (!!$scope.activeUser) {
		var index = $scope.users.indexOf($scope.activeUser);
		if (index < 0) {
			for (var i = 0; i < $scope.users.length; i++) {
				if ($scope.users[i].email == $scope.activeUser.email) {
					$scope.activeUser = $scope.users[i];
					break;
				}
			}
		}
	}
}]);
