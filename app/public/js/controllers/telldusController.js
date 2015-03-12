function TelldusController()
{
	// bind event listeners to button clicks
	var that = this;

	// Handle unlink of Telldus devices
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

// Function for handling user clicks and the actions related to it
function setOnclicks() {
	var allDevicesList = document.getElementById('allDevicesList').childNodes;

	var atags = document.getElementsByClassName('addDevice');

	var btags = document.getElementsByClassName('removeDevice');

	for (var i = 0; i < atags.length; i++) {
        addEvent(atags[i], "click", addDevice);
    }

    for (var i = 0; i < btags.length; i++) {
        addEvent(btags[i], "click", removeDevice);
    }
}

function addEvent(element, event_name, func) {
    if (element.addEventListener) {
        element.addEventListener(event_name, func, false);
    } else if (element.attachEvent)  {
        element.attachEvent("on"+event_name, func);
    }
}

// Add the clicked device to the devicelist to be tracked by HomeSharp
function addDevice(event)
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

// Remove the clicked device from the devicelist tracked by HomeSharp
function removeDevice(event)
{
	var that = this;
	$.ajax({
		url: "/brand/telldus/removeDeviceFromDb",
		type: "POST",
		data: {deviceId: event.target.id},
		success: function(data){
			removeDeviceFromUsersList(event.target.id);
		},
		error: function(jqXHR){
			console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});
}

// Function for moving the clicked item from the "not tracked list" to the "tracked list"
function moveDeviceToUsersList(id) {
	var allDevicesList = document.getElementById('allDevicesList');
	var userPickedDevicesList = document.getElementById('userPickedDevicesList');
	var elementToMove = document.getElementById(id).parentNode;
	var elementToMoveChild = document.getElementById(id);
	elementToMoveChild.setAttribute('class', '');

	removeHandler(elementToMoveChild, addDevice);
	elementToMoveChild.onclick = function(event){ removeDevice(event); };

	elementToMove.appendChild(elementToMoveChild);
	allDevicesList.removeChild(elementToMove);
	userPickedDevicesList.appendChild(elementToMove);
}

// Doing the opposite of the above function
function removeDeviceFromUsersList(id) {
	var allDevicesList = document.getElementById('allDevicesList');
	var userPickedDevicesList = document.getElementById('userPickedDevicesList');
	var elementToMove = document.getElementById(id).parentNode;
	var elementToMoveChild = document.getElementById(id);
	elementToMoveChild.setAttribute('class', '');

	removeHandler(elementToMoveChild, removeDevice);
	elementToMoveChild.onclick = function(event){ addDevice(event); };

	elementToMove.appendChild(elementToMoveChild);
	userPickedDevicesList.removeChild(elementToMove);
	allDevicesList.appendChild(elementToMove);
}

function removeHandler(element, func) {
    element.removeEventListener("click", func);
}

window.onload = setOnclicks;
