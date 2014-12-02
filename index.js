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
app.use(express.static(path.join(__dirname, 'tpl/gamejs')));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/tpl/game.html');
});
app.get('/game', function(req, res){
  res.sendfile(__dirname + '/tpl/gamescreen.html');
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


//Requires
var constants = require('./core/constants');
var io = require("socket.io").listen(server);
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

    socket.on('new player', function (data) {
      //Create a new character using user input
		  var new_character = Server.addUserToList(data, socket.id);
      //Add to server board
		  Server.board.addCharacter(new_character);
      //Spawn new character on a random location based on it's team
		  Server.board.spawnCharacter(new_character, constants.TEAM_GOODGUYS);

      myHero = Server.board._get_character_by_unique_id(socket.id);
      //Send message to clientes with all players
    	SocketUtils.sendPlayers(io, Server.board.characters);

      //Send player info to client
      socket.emit('myHero', myHero);
    });


    /*socket.on('updateHeroPos', function (data){
      myHero.x = data.x;
      myHero.y = data.y;
      console.log(data);
      Server.board.moveCharacter(myHero.unique_id, myHero.x, myHero.y);
      socket.emit('myHero', myHero);
      SocketUtils.sendPlayers(io, Server.board.characters);
    });*/

    socket.on('sendInput', function (data){
      if (data.key == 'up') {
        myHero.y -= myHero.speed * data.modifier;
      }
      if (data.key == 'down') {
        myHero.y += myHero.speed * data.modifier;
      }
      if (data.key == 'left') {
        myHero.x -= myHero.speed * data.modifier;
      }
      if (data.key == 'right') {
        myHero.x += myHero.speed * data.modifier;
      }

      Server.board.moveCharacter(myHero.unique_id, myHero.x, myHero.y);
      socket.emit('myHero', myHero);
      //SocketUtils.sendPlayers(io, Server.board.characters);
    });

    socket.on('sendClick', function (data) {
      myHero.x = data.cell.clickx;
      myHero.y = data.cell.clicky;

      Server.board.moveCharacter(myHero.unique_id, myHero.x, myHero.y);
      socket.emit('myHero', {'hero': myHero, 'old_hero_pos_x': data.old_hero_pos_x, 'old_hero_pos_y': data.old_hero_pos_y});
      //SocketUtils.sendPlayers(io, Server.board.characters);
    });

    socket.on('disconnect', function () {
      SocketUtils.removeFromSeek(socket.id, Server.board.seekCharacters);
    	SocketUtils.removeSocketFromList(socket.id, Server.board.characters);
    	console.log('Character '+ socket.id + ' disconnected');
    	SocketUtils.sendPlayers(io, Server.board.characters);
    });

    socket.on('receiveMessage', function (data) {
      console.log('Receiving message: '+ data.message);
      var character = SocketUtils.findPlayerBySocketId(socket.id, Server.user_list);
      ChatServer.addMessage(character.char_name, data.message);
      ChatServer.emitMessages(io);
    });


});
