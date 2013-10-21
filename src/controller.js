/**
 * Dates and their actions.
 * @param {Object} $scope Angular.js scope.
 */
function DateActions($scope) {
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
 * Action types available for a date.
 * @param {Object} $scope Angular.js scope.
 */
function ActionTypes($scope) {
	/* Open editor for this type */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', null, updateType);
	}

	/* Open editor for this type */
	$scope.edit = function (position, type) {
		$scope.$root.$broadcast('editValue', type, updateType, position);
	}
	
	/* Update an existing type (position -1 will add a type) */
	function updateType (name, icon, background, position) {
		// TODO: Error checking and server check.
		/* Check if values exist. */
		name = name || "generic";
		icon = icon || "\ue001";
		background = background || "rgb(0, 128, 0)";
		if (position == null || position < 0)
			$scope.types.push({name: name, icon: icon, background: background});
		else {
			$scope.types[position].name = name;
			$scope.types[position].icon = icon;
			$scope.types[position].background = background;
		}
	}
	
	/* Remove a type */
	function removeType (position) {
		// TODO: Error checking and server check.
		$scope.types.splice(position, 1);
	}
	
	/* Calculate the style of a type among types */
	$scope.calculateStyle = function (type, show) {
		var amount = $scope.types.length;
		var attr = {};
		if (show) attr["background"] = type.background;
			
		if (amount < 6) {
			attr["height"] = (100 / amount) + "%";
			attr["width"] = "100%";
		} else {
			attr["height"] = (100 / Math.ceil(amount/2)) + "%";
			if (this.$index == amount - 1 && amount % 2 > 0)
				attr["width"] = "100%";
			else attr["width"] = "50%";
		}
		return attr;
	}
	
	/* Initialization */
	$scope.types = [];
	
	// TODO: This should have its own controller.
	$scope.icons = ["\ue000", "\ue001", "\ue002", "\ue004", "\ue006", "\ue008", "\ue009", "\ue00a", "\ue00b", "\ue00c"];
	
	// TODO: remove this debug insertion.
	updateType("candy", "\ue006", "rgb(144, 238, 144)");
	updateType("cake", "\ue002", "rgb(255, 165, 0)");
	updateType("drink", "\ue00a", "rgb(255, 105, 180)");
	updateType("icecream", "\ue009", "rgb(176, 224, 230)");
}

/**
 * Users for the app.
 * @param {Object} $scope Angular.js scope.
 */
function Users($scope) {
	/* Open editor for this user */
	$scope.add = function () {
		$scope.$root.$broadcast('addValue', {user: true}, updateUser);
	}

	/* Open editor for this user */
	$scope.edit = function (position, user) {
		$scope.$root.$broadcast('editValue', user, updateUser, position);
	}
	
	/* Update an existing user (position -1 will add a user) */
	function updateUser (name, icon, background, position) {
		// TODO: Error checking and server check.
		/* Check if values exist. */
		name = name || "generic";
		icon = icon || "\ue001";
		background = background || "rgb(138, 43, 226)";
		if (position == null || position < 0)
			$scope.users.push({user: name, icon: icon, background: background});
		else {
			$scope.users[position].user = name;
			$scope.users[position].icon = icon;
			$scope.users[position].background = background;
		}
	}
	
	/* Remove a user */
	function removeUser (position) {
		// TODO: Error checking and server check.
		$scope.users.splice(position, 1);
	}

	/* Initialization */
	$scope.users = [];

	// TODO: remove this debug insertion.
	updateUser("Erik Anderberg", "\ue006", "rgb(255, 0, 0)");
	updateUser("Camilla Bergvall", "\ue004", "rgb(0, 255, 0)");
}

/**
 * Editor for the actions and users.
 * @param {Object} $scope Angular.js scope.
 */
function Editor($scope) {
	/* Set the state of the state machine */
	$scope.setState = function (state, back, forward) {
		if (state == $scope.states.HIDE) {
			$scope.currentState = $scope.states.HIDING;
			setTimeout(function() {
				$scope.currentState = $scope.states.HIDE;
				$scope.$apply();
			}, 500);
			return
		}
		
		if ($scope.currentState == $scope.states.HIDE) {
			$scope.prevStates = [];
			$scope.nextStates = [];
		} else if (back)
			$scope.nextStates.push($scope.currentState);
		else
			$scope.prevStates.push($scope.currentState);
		if (!forward && !back)
			$scope.nextStates = [];
		
		$scope.currentState = state;
	}

	/* State machine, go to previous */
	$scope.prevState = function () {
		if ($scope.prevStates.length == 0) {
			// TODO: This might be cancel, not save.
			save();
			$scope.setState($scope.states.HIDE);
		} else
			$scope.setState($scope.prevStates.pop(), true);
	}

	/* State machine, go to next */
	$scope.nextState = function () {
		if ($scope.nextStates.length == 0) {
			save();
			$scope.setState($scope.states.HIDE);
		} else
			$scope.setState($scope.nextStates.pop(), false, true);
	}

	/* Activate a slider */
	$scope.sliderActive = function (color, event) {
		var body = document.querySelector("body");
		if (color) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			$scope.active = color;
			sliderChange(event);
			body.onmousemove = function (e) {
				$scope.$apply(sliderChange(e ? e : window.event));
			};
			body.onmouseup = function () {
				$scope.$apply($scope.sliderActive());
			};
		} else {
			$scope.active = null;
			body.onmousemove = null;
			body.onmouseup = null;
		}
	}

	/* Change a slider when applicable */
	function sliderChange (event) {
		if ($scope.active) {
			var head = document.querySelector("." + $scope.active.name + " .slider-header");
			var pos = document.querySelector("." + $scope.active.name + " .slider-line").getBoundingClientRect();
			var mouseX = event.clientX;

			if (mouseX < pos.left)
				$scope.active.value = 0;
			else if (mouseX > pos.right)
				$scope.active.value = 255;
			else
				$scope.active.value = Math.round((mouseX - pos.left) / (pos.right - pos.left)*255);
		}
	}
	
	/* Update color values */
	function setColor (color, value, old) {
		value = value == "" ? 0 : parseInt(value);
		color.value = isNaN(value) ? old : value < 0 ? 0 : value > 255 ? 255 : value;
		color.intensity = value/255;
		color.others = 255 - color.value;
	}
	
	function save () {
		$scope.save(null, $scope.icon,
			"rgb(" + $scope.r.value + ", " + $scope.g.value + ", " + $scope.b.value + ")",
			$scope.editPosition);
	}
	
	/* Setup the editor from input */
	function setupEditor (saveFunc, position, isUser) {
		if (isNaN(position) || !saveFunc) {
			throw "Strange editor setup values, check them out";
		}
		$scope.save = saveFunc;
		
		$scope.editPosition = position;
		if (isUser)
			$scope.isUser = true;
		else
			$scope.isUser = false;
	}
	
	/* Listen to edit events */
	$scope.$on('editValue', function(event, type, saveFunc, position) {
		var colors = type.background.match(/\d+/g);
		if (colors.length != 3) {
			throw "Strange editor setup values, check them out";
		}
		$scope.icon = type.icon;
		$scope.r.value = colors[0];
		$scope.g.value = colors[1];
		$scope.b.value = colors[2];

		setupEditor(saveFunc, position, type.user != null);
		$scope.setState($scope.states.MENU);
	});
	
	/* Listen to add events */
	$scope.$on('addValue', function(event, type, saveFunc) {
		var isUser = type.user != null;
		setupEditor(saveFunc, -1, isUser);
		$scope.setState($scope.states.ICON, true);
		
		if (isUser)
			$scope.nextStates.push($scope.states.USER);
		$scope.nextStates.push($scope.states.BACKGROUND);
	});
	
	/* Initialization */
	$scope.states = {
		HIDE: "hide",
		HIDING: "hiding",
		MENU: "menu-choice",
		USER: "user-choice",
		ICON: "icon-choice",
		BACKGROUND: "background-choice",
		DELETE: "delete-choice"
	}
	$scope.prevStates = [];
	$scope.nextStates = [];
	$scope.setState($scope.states.HIDE);

	$scope.save = null;
	$scope.isUser = false;
	$scope.editPosition = null;

	$scope.icon = "\ue006";
	$scope.r = {name: "red", value: 200};
	$scope.g = {name: "green", value: 200};
	$scope.b = {name: "blue", value: 200};
	/* Watch value changes to update color variables */
	$scope.$watch('r.value', function(value, old) { setColor($scope.r, value, old); });
	$scope.$watch('g.value', function(value, old) { setColor($scope.g, value, old); });
	$scope.$watch('b.value', function(value, old) { setColor($scope.b, value, old); });
	$scope.active = null;
}
