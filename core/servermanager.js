function ServerManager() {

	var Board = require('./board');

	this.user_list = Array();
	this.board = new Board(30, 30, 5, 0);

	ServerManager.prototype.addUserToList = function(data, socket_id) {
		var Character = require('./character');

		var new_character = new Character(socket_id, data.p, 100, 100);
		console.log('Character '+ data.p + ':' + socket_id + ' added to the list');

		this.user_list.push(new_character);
		return new_character;
	}


}

module.exports = ServerManager;