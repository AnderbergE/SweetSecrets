/**
 * A service to handle storage functionality.
 * Cache for client storage is either localStorage or associative array.
 *
 * NOTE: Since we might use associative array we can not use getItem or setItem
 * from the localStorage API.
 *
 * Inspired by: https://github.com/agrublev/angularLocalStorage
 */
app.service('storageService',
	['$parse',
	function ($parse) {

	/**
	 * Parse a value into Json.
	 * @param {number|string|Object} v The value to parse
	 */
	function parseValue (v) {
		if (angular.isNumber(v) || angular.isString(v))
			return v;
		return angular.toJson(v);
	}

	/**
	 * Store a key in local storage (or browser cache) with a specific value.
	 * @param {number|string|Object} key
	 * @param {number|string|Object} value
	 * @param {Object} opts List of possible options:
	 *	- {bool} toServer If an asynchronous call to set server values
	 *	should be made. Default value true.
	 * @throws Error if key or value is not specified.
	 */
	this.save = function (key, value, opts) {
		var defaultOpts = {
			toServer: true
		}
		opts = angular.isUndefined(opts) ?
			defaultOpts : angular.extend(defaultOpts, opts);
		// TODO: Server storing.
		
		if (key == null)
			throw "Incorrect usage of storageService.save";
		storage[parseValue(key)] = parseValue(value);
	}

	/**
	 * Retrieve a value of a specific key from local storage (or browser cache).
	 * @param {number|string|Object} key
	 * @param {Object} opts List of possible options:
	 *	- {bool} fromServer If an asynchronous call to get server values
	 *	should be made. Default value false.
	 * @returns {null|number|string|Object} The value in storage,
	 *	or undefined if non-existing.
	 */
	this.load = function (key, opts) {
		var defaultOpts = {
			fromServer: false
		}
		opts = angular.isUndefined(opts) ?
			defaultOpts : angular.extend(defaultOpts, opts);
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
	 * @param {Object} scope The scope to add the variable to.
	 * @param {number|string|Object} key The name of the variable.
	 * @param {Object} opts List of possible options:
	 *	- defaultValue Value to store if key does not exist.
	 
	 * @throws Error if scope or key is not specified.
	 */
	this.bind = function (scope, key, opts) {
		if (scope == null || key == null)
			throw "Incorrect usage of storageService.bind";

		var defaultOpts = {
			defaultValue: '',
			prefix: ''
		}
		opts = angular.isUndefined(opts) ?
			defaultOpts : angular.extend(defaultOpts, opts);

		var prefixKey = opts.prefix + key;
		if (this.load(prefixKey) == null)
			this.save(prefixKey, opts.defaultValue);

		$parse(key).assign(scope, this.load(prefixKey));

		bindings[key] = scope.$watch(key, function (val) {
			if (angular.isDefined(val)) {
				storageService.save(prefixKey, val);
			}
		}, true);
	}

	/**
	 * Bind a scope variable to local storage (or browser cache).
	 * @param {Object} scope The scope to add the variable to.
	 * @param {number|string|Object} key The name of the variable.
	 * @throws Error if scope or key is not specified.
	 */
	this.unbind = function (scope, key) {
		if (scope == null || key == null)
			throw "Incorrect usage of storageService.unbind";

		delete scope.key;
		if (key in bindings) {
			bindings[key]();
			delete bindings[key];
		}
	}

	var storage = (typeof(Storage) !== "undefined") ? localStorage : {};
	var storageService = this;
	var bindings = {};
}]);
