var Ploy = {
	config: {},
	environment: '',

	onSelectedEnvironment: function (button) {
		console.log('button: ' + button.innerText + ' clicked');

		environment = button.innerText;
		Ploy.removeButtons();
		Ploy.replaceText($('h1'), 'Deploy Matrix for: ' + environment);
		Ploy.addDeployMatrix();
	},

	removeButtons: function () {
		console.log('remove all buttons');
		$(':button').remove();
	},

	replaceText: function (element, text) {
		element.text(text);
	},

	addDeployMatrix: function () {
		$.ajax({
			type: 'get',
	    	url: '/getVersions',
	    	success: function (versions) {
	        	console.log('success!! addDeployMatrix');
	        	Ploy.addVersionsElements(versions, Ploy.config.services);
	    	}
		});
	},

	addClickListener: function (callback) {
		$(':button').click(function () {
			callback(this);
		});
	},

	addVersionsElements: function (versions, services) {
		var body;

		body = $('body');

		for (var i = services.length - 1; i >= 0; i--) {
			var appended = $('<div class="column"><p class="serviceHeader">' + services[i].id + '</p></div>').appendTo(body);
			
			for (var j = versions.length - 1; j >= 0; j--) {				
				appended.append('<div class="checkbox"><input type="radio" value="' + versions[j] + '" id="roundedOne" name="service_' + services[i].id + '" >' + versions[j] +'</input></div>');
				
			};
		};
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
        	console.log('success!! getConfig');

        	Ploy.config = data;
        	Ploy.addButtons(data.environments);	
    		Ploy.addClickListener(Ploy.onSelectedEnvironment);
    	}
	});
});
