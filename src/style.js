/* Initialize for style calculations */
var position_wrapper_date = document.getElementById("position-wrapper-date");
var html = document.getElementsByTagName("html")[0];
window.onresize = calculateGeneralStyle;
window.onload = calculateGeneralStyle;

/**
 * Calculates the width of the position wrapper date.
 * This is needed because some browsers do not handle vh and vw correctly.
 */
 // TODO: Only do this when it is needed (webkit).
function calculateGeneralStyle () {
	if (window.innerHeight <= window.innerWidth) {
		position_wrapper_date.style.paddingTop = (3*window.innerHeight/25) + "px";
		position_wrapper_date.style.width = window.innerHeight + "px";
	}
	html.style.fontSize = "1vmin";
}
