function SocketUtils() {

	this.test = 'aaa';

	SocketUtils.prototype.findPlayerBySocketId = function(players, socketid) {
		for (var i = 0; i < players.length; i++) {
			if (players[i].socketid == socketid) {
				return players[i];
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
		io.sockets.emit('update players', players);
	}


}



module.exports = new SocketUtils();