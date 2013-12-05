/**
 * An angular directive that makes action-icon elements into sweet html.
 * @attribute {string} inputType	What type the input should be, undefined means no input element.
 * @attribute {string} inputId		Id of the input element
 * @attribute {string} inputName	Name of the input element (for grouping)
 * @attribute {string} inputValue	Value of the input element, if undefined inputId will be used
 * @attribute {string} inputModel	Angular model of the input element
 * @attribute {string} inputDirective	Angular directive for the model
 * @attribute {string} forInput		Which input to trigger on click, if undefined inputId will be used
 * @attribute {string} bg		Background of the action-icon (css values)
 * @attribute {string} customBg		Custom string for background items.
 */
app.directive('actionIcon', function () {
	return {
		restrict: 'E',	// use as element
		replace: true,	// get rid of element that we start with.
		scope: false,	// do not isolate scope
		template: function (element, attrs) {
			attrs.forInput = attrs.forInput || attrs.inputId;
			attrs.inputValue = attrs.inputValue || attrs.inputId;
			
			return '<div class="action-icon">' +
					(!attrs.inputType ? '' : '<input type="' + attrs.inputType + '"' +
					(!attrs.inputId ? '' : ' id="' + attrs.inputId + '"') +
					(!attrs.inputName ? '' : ' name="' + attrs.inputName + '"') +
					(!attrs.inputValue ? '' : ' value="' + attrs.inputValue + '"') +
					(!attrs.inputModel ? '' : ' ng-model="' + attrs.inputModel + '"') +
					(!attrs.inputDirective ? '' : ' ' + attrs.inputDirective) +
					' class="action-selected" />') +
					'<label class="action-button"' +
						(!attrs.click ? '' : ' ng-click="' + attrs.click + '"') +
						(!attrs.forInput ? '' : ' for="' + attrs.forInput + '"') + '>' +
						(!attrs.bg && !attrs.customBg ? '' :
						'<div class="action-bgs"><div class="action-bg" ' +
							(!attrs.bg ? '' : 'style="background: ' + attrs.bg + ';"') +
							(!attrs.customBg ? '' : attrs.customBg) +
						'></div></div>') +
						'<span class="action-text">' + (attrs.icon ? attrs.icon : '') + '</span>' +
					'</label>' +
				'</div>';
		}
	}
});
