var Ploy = {
	onClicked: function (button) {
		console.log('button: ' + button.innerText + ' clicked');
	},

	addClickListener: function (callback) {
		$(':button').click(function () {
			callback(this);
		});
	},

	addButtons: function (configuredEnvironments) {
		var body = $('body');

		for (var i = configuredEnvironments.length - 1; i >= 0; i--) {
			body.append('<button>' + configuredEnvironments[i].id + '</button>');
		};
	}
}

$(document).ready(function () {
	console.log('Ploy loaded');

	$.ajax({
    	type: 'get',
    	url: '/getConfig',
    	success: function (data) {
        	console.log('success!!');

        	Ploy.addButtons(data.environments);	
    		Ploy.addClickListener(Ploy.onClicked);
    	}
	});
});
