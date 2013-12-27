/**
 * Editor for the actions and users.
 */
app.directive('editor',
	function () {

	return {
		restrict: 'E',	// use as element
		replace: true,	// get rid of element that we start with.
		scope: true,	// create isolate scope
		templateUrl: 'templates/editor.html',
		controller: function ($scope, $timeout) {
			/* Set the state of the state machine */
			$scope.setState = function (state, back, forward) {
				if (state == $scope.states.HIDE) {
					$scope.currentState = $scope.states.HIDING;
					$timeout(function() {
						$scope.currentState = $scope.states.HIDE;
						$scope.$apply();
					}, 500);
					return
				}
				
				if ($scope.currentState == $scope.states.HIDE) {
					/* New editor, reset history states. */
					$scope.prevStates = [];
					$scope.nextStates = [];
				} else if (back)
					$scope.nextStates.push($scope.currentState);
				else
					$scope.prevStates.push($scope.currentState);

				if (state == $scope.states.MENU)
					/* Menu choice - reset history */
					$scope.nextStates = [];
				else if ($scope.currentState == $scope.states.MENU)
					/* Leaving menu - next should go back to menu */
					$scope.nextStates.push($scope.currentState);
				
				$scope.currentState = state;
			}

			/* State machine, go to previous */
			$scope.prevState = function () {
				/* Cancel changes. */
				if ($scope.currentState == $scope.states.BACKGROUND && !!$scope.saveItem.background)
					setupColors($scope.saveItem.background);
				angular.extend($scope.editItem, $scope.saveItem);

				if ($scope.prevStates.length == 0)
					$scope.setState($scope.states.HIDE);
				else
					$scope.setState($scope.prevStates.pop(), true);
			}

			/* State machine, go to next */
			$scope.nextState = function () {
				/* Save changes. */
				if ($scope.currentState == $scope.states.BACKGROUND)
					angular.extend($scope.editItem,
						{background: "rgb(" + $scope.r.value + ", " + $scope.g.value + ", " + $scope.b.value + ")"});
				angular.extend($scope.saveItem, $scope.editItem);

				if ($scope.nextStates.length == 0) {
					save();
					$scope.setState($scope.states.HIDE);
				} else
					$scope.setState($scope.nextStates.pop(), false, true);
			}

			/* Log out the current item */
			$scope.logout = function () {
				$scope.$root.$broadcast('logoutTrigger');
				$scope.setState($scope.states.HIDE);
			}

			/* Delete the current item */
			$scope.delete = function () {
				$scope.save(/* No updateItems will remove the item */);
				$scope.setState($scope.states.HIDE);
			}
			
			/* Update color values */
			function setColor (color, value, old) {
				value = (value == "" ? 0 : parseInt(value));
				color.value = (isNaN(value) ? old : value < 0 ? 0 : value > 255 ? 255 : value);
				color.intensity = value/255;
				color.others = 255 - color.value;
			}
			
			/* Call the save method (supplied to the setup) */
			function save () {
				$scope.save($scope.saveItem);
			}
			
			/* Setup the editor from input */
			function setupEditor (item, saveFunc) {
				if (!saveFunc)
					throw "Strange editor setup values, check them out";
				$scope.save = saveFunc;
				
				$scope.form.$setPristine(); // Reset form validation.
				$scope.saveItem = item;
				$scope.editItem = angular.copy(item);
				$scope.isUser = item.email != null;
			}
			
			/* Setup the color sliders from an rgb string */
			function setupColors (rgbString) {
				var colors = rgbString.match(/\d+/g);
				if (colors.length != 3) {
					throw "Strange editor setup values, check them out";
				}
				$scope.r.value = colors[0];
				$scope.g.value = colors[1];
				$scope.b.value = colors[2];
			}

			/* Listen to edit events */
			$scope.$on('editValue', function(event, item, saveFunc) {
				setupEditor(item, saveFunc);
				setupColors(item.background);
				$scope.setState($scope.states.MENU);
			});
			
			/* Listen to add events */
			$scope.$on('addValue', function(event, item, saveFunc) {
				setupEditor(item, saveFunc);
				$scope.editItem.icon = $scope.availableIcons[Math.floor(Math.random() * $scope.availableIcons.length)];
				if ($scope.isUser)
					$scope.editItem.pass = "";
				$scope.r.value = Math.floor(Math.random() * 155 + 100);
				$scope.g.value = Math.floor(Math.random() * 155 + 100);
				$scope.b.value = Math.floor(Math.random() * 155 + 100);
				
				$scope.setState($scope.states.ICON, true);
				if ($scope.isUser)
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

			$scope.save = null;
			$scope.saveItem = null;
			$scope.editItem = null;
			$scope.isUser = false;

			$scope.availableIcons = ["\ue000", "\ue001", "\ue002", "\ue004", "\ue006", "\ue008", "\ue009", "\ue00a", "\ue00b", "\ue00c"];
			/* For the color slider, note that the names correspond to the slider names! */
			$scope.r = {name: "red", value: 200};
			$scope.g = {name: "green", value: 200};
			$scope.b = {name: "blue", value: 200};
			/* Watch value changes to update color variables */
			$scope.$watch('r.value', function(value, old) { setColor($scope.r, value, old); });
			$scope.$watch('g.value', function(value, old) { setColor($scope.g, value, old); });
			$scope.$watch('b.value', function(value, old) { setColor($scope.b, value, old); });
			
			/* Add input events */
			angular.forEach([$scope.r, $scope.g, $scope.b], function(color) {
				var sl = document.querySelector("." + color.name);
				var el = sl.querySelector(".slider");
				var line = sl.querySelector(".slider-line");

				function sliderChange (e) {
					e = e || window.event;
					$scope.$digest((function () {
						var pos = line.getBoundingClientRect();
						var xPos = e.clientX;

						color.value = xPos < pos.left ? 0 :
							xPos > pos.right ? 255 :
							Math.round((xPos - pos.left) / (pos.right - pos.left)*255);
					})());
				}

				addEvent(el, "mousedown", function(e) {
					e.preventDefault();
					sliderChange(e);
					addEvent(global_body, 'mousemove', sliderChange);
					addEvent(global_body, 'mouseup', function () {
						/* We don't want to keep the body event handlers running :) */
						removeEvent(global_body, 'mousemove', sliderChange);
						removeEvent(global_body, 'mouseup', arguments.callee);
					});
				});
				// TODO: Only add touch when necessary?
				var touchFunc = function(e) {
					e.preventDefault();
					sliderChange(e.touches.item(0));
				}
				addEvent(el, "touchstart", touchFunc);
				addEvent(el, "touchmove", touchFunc);
				addEvent(sl, "mousewheel", function (e) {
					$scope.$digest((function () {
						color.value += (e.wheelDelta || -e.detail) > 0 ? 1 : -1;
					})());
				});
			});
		}
	}
});
