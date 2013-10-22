var Ploy = {
	config: {},
	environment: '',

	onSelectedEnvironment: function (button) {
		console.log('button: ' + button.innerText + ' clicked');

		environment = button.innerText;
		Ploy.removeButtons();
		Ploy.replaceText($('h1'), 'Deploy Matrix for: ' + environment);
		Ploy.addDeployMatrix();
		Ploy.addDeployButton();
		Ploy.addNotificationArea();
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

	addDeployButton: function () {
		var body = $('body');
		body.append('<button class="deployMatrix">Submit</button>');
		$('.deployMatrix').click(function () {
			Ploy.onDeployMatrix(this);
		});
	},

	addNotificationArea: function () {
		var body = $('body');
		body.append('<div id="versionsArea"></div>');

		body.append('<div id="notificationArea"></div>');
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
		clickedValue = $(this).val();
		console.log("Selected: "  + clickedService + ' ' + clickedValue);
		if (clickedService === "service_All") {
			$("input[value='" + clickedValue + "'").prop('checked', true);
		} else {
			$('[name="service_All"]').prop('checked', false)
		};
	},

	onDeployMatrix: function (button) {
		var matrix = _.map($(':checked'), function(input) { 
			return {name: input.name, value: input.value};
		});

		console.log('Deploying ' + matrix.length + ' services to: '+ environment);

		for (var i = matrix.length - 1; i >= 0; i--) {
			$.ajax({
    			type: 'post',
    			data: JSON.stringify({"matrix": matrix[i], "environment": environment}),
    			url: '/deployMatrix',
    			success: function (data) {
        			console.log('success!! deployMatrix: ' + data);
					Ploy.notify(data);
	    		}
			});
		};
	},

	notify: function (message) {
		var notificationArea = $("#notificationArea");
		var content = document.createTextNode(message);
		notificationArea.append('<p>' + message + ' time: ' + new Date().toLocaleTimeString() + '</p></br>');
	},

	addVersionsElements: function (versions, services) {
		var versionsArea;
		versionsArea = document.getElementById("versionsArea");

		for (var i = 0; i < services.length; i++) {
			var appended = $('<div class="column"><p class="serviceHeader">' + services[i].id + '</p></div>').appendTo(versionsArea);
			
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
