var socket = io.connect('http://192.168.15.13:3001', {'forceNew': true});

socket.on('get-messages', function(data){
	console.log(data);
	render(data);
});

function render(data){
	var html = data.map(function(data, index){
		return(`<div>
			<strong>${data.autor}</strong>:
			<em>${data.txt}</em>
			</div>`);
	}).join(" ");

	document.getElementById('messages').innerHTML = html;
}

function addMessage(e){
	var payload = {
		id: 1,
		autor: name,
		txt: document.getElementById('txt').value
	};

	socket.emit('new-mensaje', payload);
	return false;
}

window.onload=miFunction;

function miFunction(){
	//alert("Hola");
	name = prompt("Agrega tu nombre");
	console.log("Nombre ingresado es: " + name);
	socket.emit("new-user", {username: name});
	//socket.on("")
}

socket.on('change-channel', function(data){
	document.getElementById('messages').innerHTML = '';
	var html = data.map(function(data, index){
		return(`<div>
			<strong>${data.autor}</strong>:
			<em>${data.txt}</em>
			</div>`);
	}).join(" ");

	document.getElementById('messages').innerHTML = html;
});

function selectChange(){
	var x = document.getElementById("channel");
    var i = x.selectedIndex;
    //alert(x.options[i].value);

	socket.emit('change-channel', {channel: x.options[i].value, username: name});    
}