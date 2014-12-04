function Server() {

	var Board = require('./board');
	var SocketUtils = require('./socketutils');

	this.server_id = SocketUtils.generateServerId();
	this.user_list = Array();
	this.board = new Board(1748, 1344, 5, 0);
	this.turnQueue = Array();

	Server.prototype.addUserToList = function(data, socket_id) {
		var Character = require('./character');
		var new_character = new Character(socket_id, data.nickname, 0, 0);
		this.user_list.push(new_character);

		this.addUserToTurnQueue(socket_id);
		return new_character;
	}


	Server.prototype.addUserToTurnQueue = function(socket_id) {
		this.turnQueue.push(socket_id);
	}

	Server.prototype.getCurrentPlayerTurn = function(socket_id) {
		if (this.turnQueue[0] == null) {
			this.addUserToTurnQueue(socket_id);
		}

		console.log('Current player playing: ' + this.turnQueue[0]);

		return this.turnQueue[0];
	}

	Server.prototype.onDisconnectRemoveTurns = function(socket_id) {

		for (var x = 0; x < this.turnQueue.length; x++) {
			if (this.turnQueue[x] == socket_id) {
				this.turnQueue.splice(x, 1);
			}
		}

	}

	Server.prototype.moveQueue = function(socket_id) {

		if (socket_id == this.turnQueue[0]) {
			var last_player = this.turnQueue[0];
			this.turnQueue.splice(0, 1);
			this.turnQueue.push(last_player);
			return this.turnQueue[0];
		}
		else {
			return false;
		}


	}


}

module.exports = Server;
