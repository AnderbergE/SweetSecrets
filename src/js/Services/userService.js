/**
 * A service to handle users.
 */
app.service('userService', ['$rootScope', '$http', 'storageService', function ($rootScope, $http, storage) {
	/* Get the current users. */
	this.getUsers = function () {
		return $scope.users;
	}

	/* Get the active user. */
	this.getActiveUser = function () {
		return $scope.activeUser;
	}

	/* Update a user. */
	this.updateUser = function (user) {
		var index = $scope.users.indexOf(user);
		if (index < 0)
			$scope.users.push(user);
		else
			angular.extend($scope.users[index], user);
	}

	/* Remove a user. The user is logged out if currently logged in. */
	this.removeUser = function (user) {
		// TODO: Error checking and server check.
		var index = $scope.users.indexOf(user);
		if (index >= 0)
			$scope.users.splice(index, 1);
		if ($scope.users.indexOf(this.getActiveUser()) < 0)
			this.logout();
	}

	/* Log in a user. */
	this.login = function (user) {
		$scope.activeUser = user;
		return true;
	}

	/* Log out a user. */
	this.logout = function () {
		$scope.activeUser = null;
	}

	/* We need to create a scope for the service so that we can bind to it. */
	var $scope = $rootScope.$new();
	storage.bind($scope, 'users', { defaultValue: [] });
	storage.bind($scope, 'activeUser', { defaultValue: null });
}]);
