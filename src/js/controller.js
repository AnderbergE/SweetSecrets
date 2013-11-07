/* Angular app baby yeah! */
var app = angular.module('theApp', []);

/**
 * An angular directive that makes action-icon elements into sweet html.
 * @attribute {string} inputType	What type the input should be, undefined means no input element.
 * @attribute {string} inputId		Id of the input element
 * @attribute {string} inputName	Name of the input element (for grouping)
 * @attribute {string} inputValue	Value of the input element, if undefined inputId will be used
 * @attribute {string} inputModel	Angular model of the input element
 * @attribute {string} forInput		Which input to trigger on click, if undefined inputId will be used
 * @attribute {string} background	Background of the action-icon (css values)
 * @attribute {string} customBackground	Custom string for background items.
 */
app.directive('actionIcon', function () {
	return {
		restrict: 'E',	// use as element
		replace: true,	// get rid of element that we start with.
		scope: false,	// do not isolate scope
		template: function (element, attrs) {
			attrs.forInput = attrs.forInput || attrs.inputId;
			attrs.inputValue = attrs.inputValue || attrs.inputId;
			
			return '<div class="action-icon circle">' +
					(!attrs.inputType ? '' : '<input type="' + attrs.inputType + '"' +
					(!attrs.inputId ? '' : ' id="' + attrs.inputId + '"') +
					(!attrs.inputName ? '' : ' name="' + attrs.inputName + '"') +
					(!attrs.inputValue ? '' : ' value="' + attrs.inputValue + '"') +
					(!attrs.inputModel ? '' : ' ng-model="' + attrs.inputModel + '"') +
					' class="action-selected" />') +
					'<label class="action-button"' +
						(!attrs.forInput ? '' : ' for="' + attrs.forInput + '"') + '>' +
						(!attrs.background && !attrs.customBackground ? '' :
						'<div class="action-bgs"><div class="action-bg" ' +
							(!attrs.background ? '' : 'style="background: ' + attrs.background + ';"') +
							(!attrs.customBackground ? '' : attrs.customBackground) +
						'></div></div>') +
						'<span class="action-text">' + (attrs.icon ? attrs.icon : '') + '</span>' +
					'</label>' +
				'</div>';
		}
	}
});

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
 * Dates and their actions.
 * @param {Object} $scope Angular.js scope.
 */
function DateActions($scope, $timeout) {
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

	/* Initialization */
	var NEARBY_DATES = 3;
	$scope.today = getStrippedTime();
	$scope.selected = $scope.today;
	fillMonth($scope.selected);
}

/**
 * Action types available for a date.
 * @param {Object} $scope Angular.js scope.
 */
function ActionTypes($scope, collectionHandler) {
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
}

/**
 * Users for the app.
 * @param {Object} $scope Angular.js scope.
 */
function Users($scope, collectionHandler) {
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
		if (!forward && !back ||
			state == $scope.states.MENU)
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
		if (color) {
			event.preventDefault ? event.preventDefault() : event.returnValue = false;
			$scope.active = color;
			sliderChange(event);

			global_body.onmousemove = function (e) {
				$scope.$digest(sliderChange(e ? e : window.event));
			};
			global_body.onmouseup = function () {
				$scope.sliderActive();
			};
		} else {
			$scope.active = null;
			global_body.onmousemove = null;
			global_body.onmouseup = null;
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
	
	/* Call the save method (supplied to the setup) */
	function save () {
		$scope.save({icon: $scope.icon,
			background: "rgb(" + $scope.r.value + ", " + $scope.g.value + ", " + $scope.b.value + ")"});
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

		setupEditor(saveFunc, position, type.email != null);
		$scope.setState($scope.states.MENU);
	});
	
	/* Listen to add events */
	$scope.$on('addValue', function(event, type, saveFunc) {
		var isUser = type.email != null;
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
		REMOVE: "remove-choice"
	}
	$scope.prevStates = [];
	$scope.nextStates = [];
	$scope.setState($scope.states.HIDE);
	$scope.availableIcons = ["\ue000", "\ue001", "\ue002", "\ue004", "\ue006", "\ue008", "\ue009", "\ue00a", "\ue00b", "\ue00c"];

	$scope.save = null;
	$scope.isUser = false;
	$scope.editPosition = null;

	$scope.icon = "\ue006";
	/* For the color slider, note that the names correspond to the slider names! */
	$scope.r = {name: "red", value: 200};
	$scope.g = {name: "green", value: 200};
	$scope.b = {name: "blue", value: 200};
	/* Watch value changes to update color variables */
	$scope.$watch('r.value', function(value, old) { setColor($scope.r, value, old); });
	$scope.$watch('g.value', function(value, old) { setColor($scope.g, value, old); });
	$scope.$watch('b.value', function(value, old) { setColor($scope.b, value, old); });
	$scope.active = null;

	/* Add touch events */
	// TODO: Only do this when necessary.
	Array.prototype.forEach.call([$scope.r, $scope.g, $scope.b], function(color) {
		var el = document.querySelector("." + color.name + " .slider");
		el.addEventListener("touchstart", function(e) {
			e.preventDefault();
			$scope.active = color;
			$scope.$digest(sliderChange(e.touches.item(0)));
		}, false);
		el.addEventListener("touchmove", function (e) {
			e.preventDefault();
			$scope.$digest(sliderChange(e.touches.item(0)));
		}, false);
		el.addEventListener("touchend", function (e) {
			e.preventDefault();
			$scope.active = null;
		}, false);
	});
}
