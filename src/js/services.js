/**
 * A service to handle collection functions of users and actions.
 */
app.service('collectionHandler', function () {
	/* Update an existing collection (position -1 will add a user) */
	this.updateCollection = function (collection, updateItems, position) {
		// TODO: Error checking and server check.
		if (position == null || position < 0)
			collection.push(updateItems);
		else {
			for (item in updateItems) {
				collection[position][item] = updateItems[item];
			}
		}
	}
	
	/* Remove something from a collection */
	this.removeCollection = function (collection, position) {
		// TODO: Error checking and server check.
		collection.splice(position, 1);
	}
});

/**
 * A service to handle date functionality.
 */
app.service('dateService', ['$timeout', 'storageService', function ($timeout, storage) {
	this.getToday = function () {
		return today;
	}

	/* Fill the calendar for this month. */
	this.fillMonth = function (timestamp) {
		var dates = {};
		var end = (getLastDayInMonth(timestamp)).getDate();
		var date = new Date(timestamp);
		var temp;
		for (var i = 1; i <= end; i++) {
			date.setDate(i);
			temp = date.setHours(0,0,0,0);
			dates[temp] = storage.load(temp);
			if (!dates[temp])
				dates[temp] = {};
		}
		return dates;
	}

	/* Set the nearby class to day elements */
	this.updateNearbyStyle = function (selected) {
		// Remove old nearby dates.
		var old = global_position_wrapper_date.querySelectorAll(".nearby");
		for (var i = 0; old && i < old.length; i++) {
			old[i].className = old[i].className.replace(" nearby", "");
		}

		// Add new nearby dates.
		var day = document.getElementById(selected);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " nearby";
			var prev = day.previousElementSibling;
			var next = day.nextElementSibling;
			for (var i = 1; i <= NEARBY_DATES; i++) {
				if (prev) {
					prev.className = prev.className + " nearby";
					prev = prev.previousElementSibling;
				}
				if (next){
					next.className = next.className + " nearby";
					next = next.nextElementSibling;
				}
			}
		}

		setTodayStyle();
	}

	/* If today is in the month, make it show */
	function setTodayStyle () {
		var old = global_position_wrapper_date.querySelectorAll(".today");
		for (var i = 0; old && i < old.length; i++) {
			old[i].className = old[i].className.replace(" today", "");
		}

		var day = document.getElementById(today);
		if (day) {
			day = day.parentNode;
			day.className = day.className + " today";
		}
	}

	/* Make sure that "today" is actually today */
	function updateTodayTimer () {
		today = getStrippedTime();
		setTodayStyle();
		$timeout(updateTodayTimer, (new Date()).setHours(24,0,0,0) - (new Date()).getTime());
	}

	var NEARBY_DATES = 3;
	var today;
	updateTodayTimer();
}]);

/**
 * A service to handle storage functionality.
 * Cache for client storage is either localStorage or associative array.
 *
 * NOTE: Since we might use associative array we can not use getItem or setItem
 * from the localStorage API.
 *
 * Inspired by: https://github.com/agrublev/angularLocalStorage
 */
app.service('storageService', ['$parse', function ($parse) {
	function parseValue (val) {
		if (angular.isNumber(val) || angular.isString(val))
			return val;
		return angular.toJson(val);
	}

	/**
	 * Store a key in local storage (or browser cache) with a specific value.
	 * @param {number|string|Object} key
	 * @param {number|string|Object} value
	 * @param {bool} toServer If an asynchronous call to set server values
	 *	should be made. Default value true.
	 * @throws Error if key or value is not specified.
	 */
	this.save = function (key, value, toServer) {
		toServer = toServer || true;
		// TODO: Server storing.
		
		if (key == null || value == null)
			throw "Incorrect usage of storageService.save";
		storage[parseValue(key)] = parseValue(value);
	}

	/**
	 * Retrieve a value of a specific key from local storage (or browser cache).
	 * @param {number|string|Object} key
	 * @param {bool} fromServer If an asynchronous call to get server values
	 *	should be made. Default value false.
	 * @returns {null|number|string|Object} The value in storage,
	 *	or undefined if non-existing.
	 */
	this.load = function (key, fromServer) {
		fromServer = fromServer || false;
		// TODO: Server retrieving.
		
		return angular.fromJson(storage[parseValue(key)]);
	}

	/**
	 * Remove a specific key from local storage (or browser cache).
	 * @param {number|string|Object} key
	 */
	this.clear = function (key) {
		delete storage[parseValue(key)];
	}

	/**
	 * Remove all values from local storage (or browser cache).
	 */
	this.clearAll = function () {
		angular.isFunction(storage.clear) ? storage = {} : storage.clear();
	}

	/**
	 * Bind a scope variable to local storage (or browser cache).
	 * @param {Object} $scope The scope to add the variable to.
	 * @param {number|string|Object} key The name of the variable.
	 * @param {Object} opts List of possible options:
	 *	- defaultValue Value to store if key does not exist.
	 * @throws Error if $scope or key is not specified.
	 */
	this.bind = function ($scope, key, opts) {
		if ($scope == null || key == null)
			throw "Incorrect usage of storageService.bind";

		var defaultOpts = {
			defaultValue: ''
		}
		opts = angular.isUndefined(opts) ?
			defaultOpts : angular.extend(defaultOpts, opts);

		if (this.load(key) == null)
			this.save(key, opts.defaultValue);

		$parse(key).assign($scope, this.load(key));

		$scope.$watch(key, function (val) {
			if (angular.isDefined(val)) {
				storageService.save(key, val);
			}
		}, true);
	}

	/**
	 * Bind a scope variable to local storage (or browser cache).
	 * @param {Object} $scope The scope to add the variable to.
	 * @param {number|string|Object} key The name of the variable.
	 * @throws Error if $scope or key is not specified.
	 */
	this.unbind = function ($scope, key) {
		if ($scope == null || key == null)
			throw "Incorrect usage of storageService.unbind";

		$parse(key).assign($scope, null);
		$scope.$watch(key, function () { });
		this.clear(key);
	}
	
	var storage = (typeof(Storage) !== "undefined") ? localStorage : {};
	var storageService = this;
}]);
