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
	        	Ploy.addVersionsElements(versions, Ploy.addAllServicesService(Ploy.config.services));
	        	Ploy.addChangeListener();
	    	}
		});
	},

	addClickListener: function (callback) {
		$(':button').click(function () {
			callback(this);
		});
	},

	addChangeListener: function (callback) {
		var inputs = $("input[type='radio']");
		inputs.change(Ploy.onVersionChanged);
	},

	onVersionChanged: function () {
		var clickedService = $(this).attr('name'),
		clickedValue = $(this).val(),
		console.log("Selected: "  + clickedService + ' ' + clickedValue);
		if (clickedService === "service_All") {
			$("input[value='" + clickedValue + "'").prop('checked', true);
		} else {
			$('[name="service_All"]').prop('checked', false)
		};
	},

	addVersionsElements: function (versions, services) {
		var body;

		body = $('body');

		for (var i = 0; i < services.length; i++) {
			var appended = $('<div class="column"><p class="serviceHeader">' + services[i].id + '</p></div>').appendTo(body);
			
			for (var j = 0; j < versions.length; j++) {				
				appended.append('<div class="checkbox"><input type="radio" value="' + versions[j] + '" name="service_' + services[i].id + '" >' + versions[j] +'</input></div>');				
			};
		};
	},

	addButtons: function (configuredEnvironments) {
		var body = $('body');

		for (var i = 0; i < configuredEnvironments.length; i++) {
			body.append('<button>' + configuredEnvironments[i].id + '</button>');
		};
	},

	addAllServicesService: function(versions) {
		versions.unshift({id: 'All'});
		return versions;
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
