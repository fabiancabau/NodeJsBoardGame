function ChatServer() {

	var SocketUtils = require('./socketutils');

	this.server_id = SocketUtils.generateServerId();
	this.messages = Array();

	ChatServer.prototype.addMessage = function(char_name, message) {
		var message = {'message_id': this.generateMessageId() ,'char_name': char_name, 'message': message};
		this.messages.push(message);
	}

	ChatServer.prototype.emitMessages = function(io) {
		io.sockets.emit('emitMessages', this.messages);
	}


	ChatServer.prototype.generateMessageId = function() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 7; i++ ) {
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	    }


	    //TODO: verificar se o ID ja existe
	    /*for (var x = 0; x < matches.length; x++) {
	    	if (text == matches[0].matchid) {
	    		return text;
	    	}
	    }*/

	    return text;
	}


}

module.exports = ChatServer;