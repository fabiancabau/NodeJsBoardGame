function ServerManager() {

	var Board = require('./board');

	this.user_list = Array();
	this.board = new Board(30, 30, 5, 0);

	/*ServerManager.prototype.run = function(io) {
		io.sockets.on('connection', function (socket) {
	

		    socket.on('new player', function (data) {
				var new_character = ServerManager.addUserToList(data, socket.id);
				ServerManager.board.addCharacter(new_character);
				ServerManager.board.spawnCharacter(ServerManager.board.characters[0], constants.TEAM_GOODGUYS);
		    	SocketUtils.sendPlayers(io, ServerManager.user_list);	    		      	
		    });

		    socket.on('disconnect', function () {
		    	SocketUtils.removeSocketFromList(socket.id, ServerManager.user_list);
		    	console.log('Character '+ socket.id + ' disconnected');
		    	SocketUtils.sendPlayers(io, ServerManager.user_list);
		    });

		});

	}*/

	ServerManager.prototype.addUserToList = function(data, socket_id) {
		var Character = require('./character');

		var new_character = new Character(socket_id, data.p, 0, 0, 0, 0, 0, 0, 0);
		console.log('Character '+ data.p + ':' + socket_id + ' added to the list');

		this.user_list.push(new_character);
		return new_character;
	}


}

module.exports = ServerManager;