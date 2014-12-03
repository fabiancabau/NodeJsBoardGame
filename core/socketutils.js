function SocketUtils() {

	SocketUtils.prototype.findPlayerBySocketId = function(socket_id, list) {
		for (var i = 0; i < list.length; i++) {
			if (list[i].unique_id == socket_id) {
				return list[i];
			}
		}
	}

	SocketUtils.prototype.removeSocketFromList = function(socket_id, list) {
		for (var x = 0; x < list.length; x++) {
			if (list[x].unique_id == socket_id) {
				list.splice(x, 1);
				return true;
			}
		}
	}

	SocketUtils.prototype.removeFromSeek = function(socket_id, list) {
		for (var x = 0; x < list.length; x++) {
			if (list[x] == socket_id) {
				list.splice(x, 1);
				return true;
			}
		}
	}

	SocketUtils.prototype.generateServerId = function() {
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ ) {
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


	SocketUtils.prototype.sendPlayers = function(io, players) {
		io.sockets.emit('update-players-array', players);
	}

	SocketUtils.prototype.sendPlayersToSocket = function(socket, players) {
		socket.emit('update-players-array-socket', players);
	}


}



module.exports = new SocketUtils();
