function Character(unique_id, char_name, x, y) {

	this.unique_id = unique_id;
	this.char_name = char_name;
	this.x = 0;
	this.y = 0;
	this.speed = 256;


	Character.prototype.move = function(direction, qty) {
		console.log('Moving: ' + direction + ':' + qty);
	}

}

module.exports = Character;