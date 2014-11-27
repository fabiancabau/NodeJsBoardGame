function Server() {

	var Board = require('./board');
	var SocketUtils = require('./socketutils');

	this.server_id = SocketUtils.generateServerId();
	this.user_list = Array();
	this.board = new Board(30, 30, 5, 0);

	/*Server.prototype.run = function(io) {
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

	}*/

	Server.prototype.addUserToList = function(data, socket_id) {
		var Character = require('./character');

		var new_character = new Character(socket_id, data.p, 0, 0, 0, 0, 0, 0, 0);
		console.log('Character '+ data.p + ':' + socket_id + ' added to the list');

		this.user_list.push(new_character);
		return new_character;
	}


}

module.exports = Server;