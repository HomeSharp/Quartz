
function NetatmoController()
{

// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/settings",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			window.location.href = '/';
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

// Handle unlink of Netatmo devices //
	$('#btn-unlinkNetatmo').click(function(){ that.unlinkNetatmo(); });

	this.unlinkNetatmo = function()
	{
		var that = this;
		$.ajax({
			url: "/brand/netatmo",
			type: "POST",
			data: {unlink : true},
			success: function(data){
				window.location.href = '/home';
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}


	
}
