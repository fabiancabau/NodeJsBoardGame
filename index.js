var express = require('express');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');


var port = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, 'core')));
app.use(express.static(path.join(__dirname, 'tpl/images')));
app.use(express.static(path.join(__dirname, 'tpl/css')));
app.use(express.static(path.join(__dirname, 'tpl/gamejs')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/tpl/game.html');
});
app.get('/game', function(req, res){
  res.sendFile(__dirname + '/tpl/gamescreen.html');
});

server.listen(port, function(){
  console.log("Express server listening on port " + port);
});

//Requires
var constants = require('./core/constants');
var Character = require('./core/character');
var SocketUtils = require('./core/socketutils');
var Server = require('./core/server');
Server = new Server();
var ChatServer = require('./core/chat');
ChatServer = new ChatServer();


console.log('Server created: ' + Server.server_id);

io.sockets.on('connection', function (socket) {

   //ChatServer.emitMessages(io);
   var myHero = new Character();
   myHero.heroImgPos = myHero.getRandomHeroImage();

    socket.on('new-player', function (data) {
      SocketUtils.sendPlayersToSocket(socket, Server.board.characters);
      //Create a new character using user input
		  var new_character = Server.addUserToList(data, socket.id, myHero.heroImgPos);
      //Add to server board
		  Server.board.addCharacter(new_character);
      //Spawn new character on a random location based on it's team
		  Server.board.spawnCharacter(new_character, constants.TEAM_GOODGUYS);
      myHero = Server.board._get_character_by_unique_id(socket.id);

      socket.emit('your-id', {'your_id': socket.id, 'player_turn_id': Server.getCurrentPlayerTurn()});
      //Send message to clients with all players
      console.log(myHero);
    	io.sockets.emit('add-new-player', myHero);
    });

    socket.on('hero-move', function (data) {
      myHero.x = data.x;
      myHero.y = data.y;

      Server.board.moveCharacter(myHero.unique_id, myHero.x, myHero.y);
      console.log(myHero);
      io.sockets.emit('hero-update', myHero);
      //io.sockets.emit('move-queue', Server.moveQueue(socket.id));
      //SocketUtils.sendPlayers(io, Server.board.characters);
    });

    socket.on('disconnect', function () {
      SocketUtils.removeFromSeek(socket.id, Server.board.seekCharacters);
    	SocketUtils.removeSocketFromList(socket.id, Server.board.characters);
    	console.log('Character '+ socket.id + ' disconnected');
      io.sockets.emit('player-disconnected', socket.id);
    	//SocketUtils.sendPlayers(io, Server.board.characters);
    });

    socket.on('receiveMessage', function (data) {
      console.log('Receiving message: '+ data.message);
      var character = SocketUtils.findPlayerBySocketId(socket.id, Server.user_list);
      ChatServer.addMessage(character.char_name, data.message);
      ChatServer.emitMessages(io);
    });


});
