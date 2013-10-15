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
	/* Add a new type of action */
	$scope.addType = function(name, icon, background) {
		// TODO: This should be checked on server.
		/* Check if values exist. */
		name = name || "generic";
		icon = icon || "\ue001";
		background = background || "rgb(0, 128, 0)";
		
		$scope.types.push({name: name, icon: icon, background: background});
	}

	/* Update an existing type */
	$scope.updateType = function(position, name, icon, background) {
		// TODO: Error checking and server check.
		$scope.types[position] = {name: name, icon: icon, background: background}
	}
	
	/* Remove an type */
	$scope.removeType = function(position) {
		// TODO: Error checking and server check.
		$scope.types.splice(position, 1);
	}
	
	/* Calculate the style of a type among types */
	$scope.calculateStyle = function(type, show) {
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
	$scope.addType("candy", "\ue006", "rgb(144, 238, 144)");
	$scope.addType("cake", "\ue002", "rgb(255, 165, 0)");
	$scope.addType("drink", "\ue00a", "rgb(255, 105, 180)");
	$scope.addType("icecream", "\ue009", "rgb(176, 224, 230)");
}

/**
 * Users for the app.
 * @param {Object} $scope Angular.js scope.
 */
function Users($scope) {
	/* Add a new type of action */
	$scope.addUser = function(name, icon, background) {
		// TODO: This should be checked on server.
		/* Check if values exist. */
		name = name || "generic";
		icon = icon || "\ue001";
		background = background || "rgb(138, 43, 226)";
		
		$scope.users.push({user: name, icon: icon, background: background});
	}

	/* Update an existing type */
	$scope.updateUser = function(position, name, icon, background) {
		// TODO: Error checking and server check.
		$scope.users[position] = {user: name, icon: icon, background: background}
	}
	
	/* Remove an type */
	$scope.removeUser = function(position) {
		// TODO: Error checking and server check.
		$scope.users.splice(position, 1);
	}

	/* Open editor for this user */
	$scope.edit = function(position, user) {
		//TODO: Only edit when applicable
		$scope.$root.$broadcast('editValue', position, user);
	}

	/* Initialization */
	$scope.users = [];

	// TODO: remove this debug insertion.
	$scope.addUser("Erik Anderberg", "\ue006", "rgb(255, 0, 0)");
	$scope.addUser("Camilla Bergvall", "\ue004", "rgb(0, 255, 0)");
}

/**
 * Editor for the actions and users.
 * @param {Object} $scope Angular.js scope.
 */
function Editor($scope) {
	$scope.editor = document.querySelector(".editor");
	$scope.states = {
		HIDE: "hide",
		MENU: "menu-choice",
		USER: "user-choice",
		ICON: "icon-choice",
		BACKGROUND: "background-choice",
		DELETE: "delete-choice"
	}
	$scope.currentState = $scope.states.HIDE;

	$scope.isEditing = false;
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

	/* Listen to edit events */
	$scope.$on('editValue', function(event, position, type) {
		var colors = type.background.match(/\d+/g);
		if (!isNaN(position && colors.length == 3)) {
			$scope.editPosition = position;
			if (type.user)
				$scope.isUser = true;
			else
				$scope.isUser = false;
			$scope.icon = type.icon;
			$scope.r.value = colors[0];
			$scope.g.value = colors[1];
			$scope.b.value = colors[2];

			$scope.isEditing = true;
			$scope.setState($scope.states.MENU);
		}
	});
	
	$scope.setState = function (state) {
		$scope.currentState = state;
	}

	/* State machine, go to previous */
	$scope.prevState = function () {
		if ($scope.currentState == $scope.states.MENU) {
			$scope.setState($scope.states.HIDE);
		} else if ($scope.currentState == $scope.states.ICON) {
			if ($scope.isEditing)
				$scope.setState($scope.states.MENU);
			else
				$scope.setState($scope.states.HIDE);
		} else if ($scope.currentState == $scope.states.BACKGROUND) {
			$scope.setState($scope.states.ICON);
		}
	}

	/* State machine, go to next */
	$scope.nextState = function () {
		if ($scope.currentState == $scope.states.ICON) {
			$scope.setState($scope.states.BACKGROUND);
		} else if ($scope.currentState == $scope.states.BACKGROUND) {
			$scope.setState($scope.states.HIDE);
		}
	}

	/* Activate a slider */
	$scope.sliderActive = function (color, event) {
		var body = document.querySelector("body");
		if (color) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			$scope.active = color;
			$scope.sliderChange(event);
			body.onmousemove = function (e) {
				$scope.$apply($scope.sliderChange(e ? e : window.event));
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
	$scope.sliderChange = function (event) {
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
}
