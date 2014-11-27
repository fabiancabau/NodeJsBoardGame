var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();
var server = http.createServer(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.use(express.static(path.join(__dirname, 'core')));
app.use(express.static(path.join(__dirname, 'tpl/images')));
app.use(express.static(path.join(__dirname, 'tpl/css'))); 

app.get('/', function(req, res){
  res.sendfile(__dirname + '/tpl/game.html'); 
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


//Requires
var constants = require('./core/constants');
var io = require("socket.io").listen(server);

var SocketUtils = require('./core/socketutils');
var Server = require('./core/server');
Server = new Server();

console.log('Server created: ' + Server.server_id);

io.sockets.on('connection', function (socket) {
	

    socket.on('new player', function (data) {
		var new_character = Server.addUserToList(data, socket.id);
		Server.board.addCharacter(new_character);
		Server.board.spawnCharacter(Server.board.characters[0], constants.TEAM_GOODGUYS);
    	SocketUtils.sendPlayers(io, Server.user_list);	    		      	
    });

    socket.on('disconnect', function () {
    	SocketUtils.removeSocketFromList(socket.id, Server.user_list);
    	console.log('Character '+ socket.id + ' disconnected');
    	SocketUtils.sendPlayers(io, Server.user_list);
    });

});




