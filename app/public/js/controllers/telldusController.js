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



	$('.addDevice').click(function(event){ that.addDevice(event); });

	this.addDevice = function(event)
	{		
		var that = this;
		$.ajax({
			url: "/brand/telldus/addDeviceToDb",
			type: "POST",
			data: {deviceId: event.target.id},
			success: function(data){
				moveDeviceToUsersList(event.target.id);
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});

	}


	function moveDeviceToUsersList(id) {
		var allDevicesList = document.getElementById('allDevicesList');
		var userPickedDevicesList = document.getElementById('userPickedDevicesList');
		var elementToMove = document.getElementById(id).parentNode;
		allDevicesList.removeChild(elementToMove);
		userPickedDevicesList.appendChild(elementToMove);
	}

	function removeDeviceFromUsersList(id) {


	}

}