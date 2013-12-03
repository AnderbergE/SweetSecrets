/**
 * A service to handle users.
 */
app.service('userService', ['$rootScope', '$http', 'storageService', function ($rootScope, $http, storage) {
	/* */
	this.getUsers = function () {
		return $scope.users;
	}

	/* */
	this.getActiveUser = function () {
		return $scope.activeUser;
	}

	/* */
	this.updateUser = function (user) {
		var index = $scope.users.indexOf(user);
		if (index < 0)
			$scope.users.push(user);
		else
			angular.extend($scope.users[index], user);
	}

	/* Remove something from a collection */
	this.removeUser = function (user) {
		// TODO: Error checking and server check.
		var index = $scope.users.indexOf(user);
		if (index >= 0)
			$scope.users.splice(index, 1);
		if ($scope.users.indexOf(this.getActiveUser()) < 0)
			this.logout();
	}

	/* */
	this.login = function (user) {
		$scope.activeUser = user;
		return true;
	}

	/* */
	this.logout = function () {
		$scope.activeUser = null;
	}

	var $scope = $rootScope.$new();
	storage.bind($scope, 'users', { defaultValue: [] });
	storage.bind($scope, 'activeUser', { defaultValue: null });
}]);
