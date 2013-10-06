/* Initialize for style calculations */
var html = document.getElementsByTagName("html")[0];
var position_wrapper_date = document.getElementById("position-wrapper-date");
var position_wrapper_actions = document.getElementById('position-wrapper-actions');
window.onresize = calculateGeneralStyle;
window.onload = calculateGeneralStyle;

/**
 * Calculates the width of the position wrapper date.
 * This is needed because some browsers do not handle vh and vw correctly.
 */
function calculateGeneralStyle () {
	// TODO: Only do stuff when it is needed (webkit, vmin, etc).
	var landscape = window.innerHeight < window.innerWidth;
	if (landscape) {
		position_wrapper_date.style.width = window.innerHeight + "px";
		position_wrapper_actions.style.paddingLeft = window.innerHeight + "px";
		position_wrapper_actions.style.paddingTop = "";
	} else {
		position_wrapper_date.style.width = "";
		position_wrapper_actions.style.paddingLeft = "";
		position_wrapper_actions.style.paddingTop = window.getComputedStyle(position_wrapper_date).height;
	}
	html.style.fontSize = "1vmin";


	// Calculate the size of the action buttons.
	var types = position_wrapper_actions.children[0].children;
	var len = types.length;
	if (getComputedStyle(types[len-1]).display == 'none') {
		len--;
	}

	var size;
	if (landscape) {
		size = calculateActionSize(position_wrapper_actions.clientWidth-position_wrapper_date.clientWidth-len,
			window.innerHeight-len, len);
	} else {
		size = calculateActionSize(window.innerWidth-len,
			window.innerHeight-position_wrapper_date.clientHeight-len, len);
	}
	// TODO: Can this be done using css class instead?
	// Such as: document.styleSheets[1].insertRule(".action { height: " + size + "; width: " + size + "; }");
	for (var i = 0; i < len; i++) {
		types[i].style.width = types[i].style.height = size;
	}
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