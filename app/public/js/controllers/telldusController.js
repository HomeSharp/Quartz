function TelldusController()
{

// bind event listeners to button clicks //
	var that = this;

// Handle unlink of Telldus devices //
	$('#btn-unlinkTelldus').click(function(){ that.unlinkNetatmo(); });

}
