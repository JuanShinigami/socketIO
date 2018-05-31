var express = require('express');
// Aplicacion express
var app = express();
// creamos el servidor le pasamos el http
var server = require('http').Server(app);

var io = require('socket.io')(server);
// Para probar le vamos a pasar un mensaje de callback
// 
// 
// 
/*var mensajes = [{
	autor: "Juan Mateo",
	txt: "Hola soy un mensaje",
}];*/
// 
// 
var groups = [];
//
//


app.use(express.static('public'));
// 
// 
app.get('/', function(req, res){
	res.status(200).send("Todo bien. vamos adelante"); 
	//console.dir(res);
});


// Que escuche el connection y que haga lo que le pasamos
io.on('connection', function(socket){

	// Crear un Bloc
	// 
	console.log("Base PATH: " + __dirname);
	console.log("Alguien se a conectado con web socket... id: " + socket.id);

	var channel = 'noshinigamis';
	var user_sesion = null;

	socket.join(channel);
	//console.log("existe " + channel + ": " + groups.includes(channel));
	if(groups[channel] == null){
		console.log("No existo me voy a crear");
		groups[channel] = new Array();
		
	}
	
	//console.log(if(groups[channel] == null)? : );
	

	//socket.emit('get-messages', {});

	socket.on('new-mensaje', function(data){
		//mensajes.push(data);
		groups[channel].push({autor: data.autor, txt: data.txt, type: true, id: data.id });
		io.sockets.in(channel).emit('get-messages', groups[channel]);
	});

	socket.on('new-user', function(data){
		user_sesion = data.username;
		console.log("Usuario mandado del socket: " + data.username);
		var user = data;
		var joined = user.username + " se ha unido.";
		//mensajes.push();
		groups[channel].push({autor: "", txt: joined, type: false, id: 0 });
		io.sockets.in(channel).emit('get-messages', groups[channel]);
		//socket.emit("added-user", mensajes);
	});

	socket.on('change-channel', function(newChannel){
		//console.log("Hice el cambio de canal ---> " + newChannel);
		socket.leave(channel);
		socket.join(newChannel.channel);
		groups[channel].push({autor: "", txt: newChannel.username + " ha abandonado el grupo.", type: false, id: 0 });
		io.sockets.in(channel).emit('get-messages', groups[channel]);
		channel = newChannel.channel;
		if(groups[channel] == null){
			groups[channel] = new Array();
		}
		groups[channel].push({autor: "", txt: newChannel.username + " se ha unido al grupo", type: false, id: 0 });
		//mensajes.push({autor: "", txt: "Te has unido al grupo - " + newChannel});
		io.sockets.in(channel).emit('change-channel', groups[channel]);
		//io.sockets.emit('change-channel', groups[channel]);
	});

	socket.on('disconnect', function(data){
		groups[channel].push({autor: "", txt: user_sesion + " ha abandonado el grupo.", type: false, id: 0 });
		io.sockets.in(channel).emit('get-messages', groups[channel]);
	});

});



server.listen(3001, function(){
	console.log('Servidor corriendo en http://localhost:8087');
});
