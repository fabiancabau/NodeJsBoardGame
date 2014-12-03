function Server() {

	var Board = require('./board');
	var SocketUtils = require('./socketutils');

	this.server_id = SocketUtils.generateServerId();
	this.user_list = Array();
	this.board = new Board(1748, 1344, 5, 0);

	Server.prototype.addUserToList = function(data, socket_id) {
		var Character = require('./character');

		var new_character = new Character(socket_id, data.nickname, 0, 0);
		console.log('Character '+ data.p + ':' + socket_id + ' added to the list');

		this.user_list.push(new_character);
		return new_character;
	}


}

module.exports = Server;
