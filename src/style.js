/**
 * Calculates the width of the position wrapper date.
 * This is needed because some browsers do not handle vh and vw correctly.
 */
window.onresize = calculateGeneralStyle;
window.onload = calculateGeneralStyle;
function calculateGeneralStyle () {
	// TODO: Only do stuff when it is needed (webkit, vmin, etc).
	var landscape = window.innerHeight < window.innerWidth;
	if (landscape) {
		global_position_wrapper_date.style.width = window.innerHeight + "px";
		global_position_wrapper_actions.style.paddingLeft = window.innerHeight + "px";
		global_position_wrapper_actions.style.paddingTop = "";
	} else {
		global_position_wrapper_date.style.width = "";
		global_position_wrapper_actions.style.paddingLeft = "";
		global_position_wrapper_actions.style.paddingTop = window.getComputedStyle(global_position_wrapper_date).height;
	}
	global_body.style.fontSize = "1vmin";

	calculateActionStyle();
}

/**
 * Calculates the size of the action types.
 */
global_toggle_edit.onclick = calculateActionStyle;
function calculateActionStyle (amount) {
	if (amount > 0)
		var len = amount;
	else
		var len = global_position_wrapper_actions.children[0].children.length;
	if (!global_toggle_edit.checked)
		len--;

	var landscape = window.innerHeight < window.innerWidth;
	var size;
	if (landscape) {
		size = calculateActionSize(global_position_wrapper_actions.clientWidth-global_position_wrapper_date.clientWidth-len,
			window.innerHeight-len, len);
	} else {
		size = calculateActionSize(window.innerWidth-len,
			window.innerHeight-global_position_wrapper_date.clientHeight-len, len);
	}
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
		if (temp >= max) {
			max = temp;
		} else {
			break;
		}
	}
	i--;
	if (max*i < width) {
		return Math.floor(max) + "px";
	}
	return (99-amount*0.25)/i + "%";
}
