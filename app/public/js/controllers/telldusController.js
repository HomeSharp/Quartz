function TelldusController()
{

// bind event listeners to button clicks //
	var that = this;

// Handle unlink of Telldus devices //
	$('#btn-unlinkTelldus').click(function(){ that.unlinkTelldus(); });

	this.unlinkTelldus = function()
	{
		var that = this;
		$.ajax({
			url: "/brand/telldus/unlink",
			type: "POST",
			data: {unlink : true},
			success: function(data){
				window.location.href = '/brand/telldus/';
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

}
