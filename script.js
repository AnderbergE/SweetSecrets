$(document).ready(function() {
	var today = 16;
	var datenav = $(".days");
	
	datenav.on("click", ".day", function (event) {
		var date = parseInt(this.innerText);
		
		datenav.empty();
		for (var i = (date-2); i <= (date+2); i++) {
			datenav.append(
				'<span class="day' +
				(i==today?" today":"") +
				'">' + i + '</span>'
			);
		}
	});
});
