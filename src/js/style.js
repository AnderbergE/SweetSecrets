addEvent(window, 'resize', calculateGeneralStyle);
addEvent(window, 'load', calculateGeneralStyle);

/* Remove the tap delays on touch interfaces. */
addEvent(window, 'load', function() {
	Array.prototype.forEach.call(document.getElementsByTagName('label'), function(el) {
		addEvent(el, 'touchend', function (e) {
		    e.preventDefault();
		    this.click();
		});
	});
});

/* Edit mode adds an icon by the actions, we need to show it correctly. */
addEvent(global_toggle_edit, 'click', calculateActionStyle);
/* When closing config, disable edit mode. */
addEvent(global_toggle_config, 'click', function () {
	if (global_toggle_edit.checked && !global_toggle_config.checked) {
		global_toggle_edit.click();
	}
});


/**
 * Calculates the width of the position wrapper date.
 * This is needed because some browsers do not handle vh and vw correctly.
 */
function calculateGeneralStyle () {
	global_body.style.fontSize = "1vmin";
	calculateActionStyle();
}

/**
 * Calculates the size of the action types.
 * @param {Number} amount How many action types there is.
 */
function calculateActionStyle (amount) {
	var len = (amount > 0 ? amount : global_position_wrapper_actions.children[0].children.length);
	if (len > 1 && !global_toggle_edit.checked)
		len--;

	var size = calculateActionSize(global_position_wrapper_actions.clientWidth-len,
		global_position_wrapper_actions.clientHeight-len, len);
	dynamicStyle.editRule(".action", "width:" + size + ";");
}

/**
 * Calculates the size of the actions icons.
 * @param {Number} width Width of the container.
 * @param {Number} height Height of the container.
 * @param {Number} amount Amount of action icons.
 * @returns {String} The suggested size, either percentage or pixel.
 */
function calculateActionSize (width, height, amount) {
	var max = 0;
	var big, small, temp, i;
	if (width > height) {
		big = width;
		small = height;
	} else {
		big = height;
		small = width;
	}

	for (i = 1; i <= amount; i++) {
		temp = Math.min(big / Math.ceil(amount / i), small / i);
		if (temp >= max)
			max = temp;
		else
			break;
	}
	i--;
	
	if (max*i < width)
		return Math.floor(max) + "px";
	return (99-amount*0.25)/i + "%";
}
