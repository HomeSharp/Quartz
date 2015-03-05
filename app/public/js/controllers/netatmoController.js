
function NetatmoController()
{

// bind event listeners to button clicks //
	var that = this;

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
				window.location.href = '/brand/netatmo';
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

}
