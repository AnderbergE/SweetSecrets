addEvent(window, 'resize', calculateGeneralStyle);

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
	if (global_timeout)
		clearTimeout(global_timeout);

	global_timeout = setTimeout(function () {
		if (global_body.clientWidth * 0.86 > global_body.clientHeight)
			angular.element(global_body).removeClass('portrait');
		else
			angular.element(global_body).addClass('portrait');
		global_body.style.fontSize = "1vmin";
		calculateActionStyle();
	}, 100);
}
calculateGeneralStyle();

/**
 * Calculates the size of the action types.
 * @param {Number} amount How many action types there is.
 */
function calculateActionStyle (amount) {
	var len = (amount > 0 ? amount : global_position_wrapper_actions.children[0].children.length);
	if (len > 1 && !global_toggle_edit.checked)
		len--;

	var width = global_position_wrapper_actions.clientWidth-len;
	var height = global_position_wrapper_actions.clientHeight-len;
	var max = 0;
	var big, small, temp, i;
	if (width > height) {
		big = width;
		small = height;
	} else {
		big = height;
		small = width;
	}

	for (i = 1; i <= len; i++) {
		temp = Math.min(big / Math.ceil(len / i), small / i);
		if (temp >= max)
			max = temp;
		else
			break;
	}
	i--;
	
	var size = (max*i < width) ? Math.floor(max) : width/i - len*0.25;
	dynamicStyle.editRule(".action", "width:" + size + "px; font-size:" + size * 0.7 + "px;");
}
