
var map = L.map('map-template').setView([19.2441047, -103.7451378], 13);
var theMarker = {};
var coords = {};



L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// El icono debe tener en su propiedad iconAnchor [mitad tamaño del icono, tamaño del icono] para que no se distorsione.
var parkIcon = L.icon({

    iconUrl: '/img/parking.png',
    iconSize: [50, 50],
	iconAnchor: [25, 50],
	popupAnchor: [1, -45],
	shadowUrl: '/img/shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]

});	

// Función que mueve el marcador a donde se presiona click
function onMapClick(e) {
	coords = [e.latlng.lat, e.latlng.lng];
	//alert("You clicked the map at " + e.latlng);
	if (theMarker != undefined) {
		map.removeLayer(theMarker);
  	}
	  theMarker = L.marker(coords, {icon: parkIcon}).addTo(map);
	  document.getElementById('new_coor').value = coords;

};

map.on('click', onMapClick);

var carIcon = L.icon({

    iconUrl: '/img/car.png',
    iconSize: [40, 40],
	iconAnchor: [20, 40],
	popupAnchor: [1, -45],
	shadowUrl: '/img/shadow.png',
    shadowSize: [68, 95],
    shadowAnchor: [22, 94]

});	

map.locate({enableHighAccuracy: true});


/*
L.marker([19.2513209, -103.7211143], {icon: parkIcon}).addTo(map)
	.bindPopup('Plaza San Fernando.');
*/


	
/*
L.marker([19.2436325, -103.7273708], {icon: parkIcon}).addTo(map)
    .bindPopup('Constitución.');
*/

// EVENTO ON CLICK PARA LLAMAR FUNCIONES PRESIONANDO EL ICONO
//L.marker([19.2436325,-103.7273708], {icon: parkIcon}).addTo(map).on('click', onClick);


function onClick(e) {
    alert("HOLA");
}
function hola() {
		console.log("AAAAAAAAAAAAAAAAA");
	};

map.on('locationfound', e => {

    const coords = [e.latlng.lat, e.latlng.lng];
    const marker = L.marker(coords,{icon: carIcon});
    marker.bindPopup('Aquí estas');
    map.addLayer(marker);
	console.log(e);
	
});


const socket = io();

var hostname = "test.mosquitto.org";
var port = 8081;
var clientId = "WebSocket";
clientId += new Date().getUTCMilliseconds();
var topic = "esli_123";

mqttClient = new Paho.MQTT.Client(hostname, port, clientId);
mqttClient.onMessageArrived = MessageArrived;
mqttClient.onConnectionLost = ConnectionLost;
Connect();

/*Initiates a connection to the MQTT broker*/
function Connect(){
	mqttClient.connect({
	onSuccess: Connected,
	onFailure: ConnectionFailed,
	keepAliveInterval: 10,
});
};

/*Callback for successful MQTT connection */
function Connected() {
	console.log("Connected to broker");
	mqttClient.subscribe(topic);
};

/*Callback for failed connection*/
function ConnectionFailed(res) {
	console.log("Connect failed:" + res.errorMessage);
};

/*Callback for lost connection*/
function ConnectionLost(res) {
	if (res.errorCode !== 0) {
		console.log("Connection lost:" + res.errorMessage);
		Connect();
	}
};

/*Callback for incoming message processing */
function MessageArrived(message) {
    document.getElementById("mqtt_test").innerHTML=message.payloadString;
	console.log(message.destinationName +" : " + message.payloadString);
};