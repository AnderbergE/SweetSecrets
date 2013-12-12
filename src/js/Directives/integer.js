/* Make sure that a model is an integer. */
app.directive('integer',
	function() {

	return {
		require: 'ngModel',
		link: function(s, e, a, c) {
			c.$parsers.unshift(function(v) {
				return parseInt(v);
			});
		}
	};
});
