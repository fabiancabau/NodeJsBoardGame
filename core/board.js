function Board(size_x, size_y, max_characters, active_characters_count) {

	var constants = require('./constants');
	var Character = require('./character');

	this.size_x = size_x;
	this.size_y = size_y;
	this.max_characters = max_characters;
	this.active_characters_count = active_characters_count;
	this.characters = Array();
	this.seekCharacters = Array();
	this.created = false;
	this.boardBody = Create2DArray(size_x, size_y);
	this.boardBackground = '';


	function Create2DArray(rows,columns) {
	   var x = new Array(rows);
	   for (var i = 0; i < rows; i++) {
	       x[i] = new Array(columns);
	   }
	   return x;
	}


	Board.prototype._is_created = function() {
		return this.created;
	}

	Board.prototype.addCharacter = function(character) {

		if (this.active_characters_count < this.max_characters && !this._has_character_on_game(character) ) {
			this.characters.push(character);
			this.seekCharacters.push(character.unique_id);
			this.active_characters_count++;
			console.log('Active characters count: ' + this.active_characters_count);
			return character;
		}
		else {
			return false;
		}

	}

	Board.prototype._get_character_by_unique_id = function(unique_id) {
		var found = false;

		for (var x = 0; x < this.characters.length; x++) {
			if (!found) {
				if (this.characters[x].unique_id == unique_id) {
					return this.characters[x];
					break;
				}
			}
		}

		return found;
	}

	Board.prototype._has_character_on_game = function(character) {

		var found = false;

		for (var x = 0; x < this.characters.length; x++) {
			if (!found) {
				if (this.characters[x].unique_id == character.unique_id) {
					console.log('Character '+ character.char_name +' already waiting on the board');
					found = true;
					break;
				}
			}
		}

		return found;
	}

	Board.prototype._has_character_on_board = function(character) {

		var found = false;

		for (var x = 0; x < this.size_x; x++) {
			for (var y = 0; y < this.size_y; y++) {
				if (!found) {
					if (this.boardBody[x][y] instanceof Character) {
						if (this.boardBody[x][y].unique_id == character.unique_id) {
							console.log('Character['+x+']['+y+'] ' + this.boardBody[x][y].unique_id) + ' already exists';
							found = true;
							break;
						}
					}
				}
			}
		}

		return found;
	}


	Board.prototype._get_character_position = function(character) {

		var found = false;

		for (var x = 0; x < this.size_x; x++) {
			for (var y = 0; y < this.size_y; y++) {
				if (!found) {
					if (this.boardBody[x][y] instanceof Character) {
						if (this.boardBody[x][y].unique_id == character.unique_id) {
							console.log(x+'-'+y);
							return {'x': x, 'y': y};
						}
					}
				}
			}
		}

		return found;	
	}

	Board.prototype._is_slot_free = function(slot) {
		if (slot instanceof Character) {
			return false;
		}
		else {
			return true;
		}
	}

	Board.prototype.spawnCharacter = function(character, side) {
		var max_x, max_y = 0;
		var min_x, min_y = 0;

		if (side == constants.TEAM_GOODGUYS) {
			max_x = (this.size_x/2) - 1;
			max_y = (this.size_y/2) - 1;

			min_x = 0;
			min_y = 0;
		}
		else {
			max_x = (this.size_x);
			max_y = (this.size_y);

			min_x = (this.size_x/2) + 1;
			min_y = (this.size_y/2) + 1;
		}

		rand_x = Math.floor((Math.random() * (max_x - min_y)) + min_x);
		rand_y = Math.floor((Math.random() * (max_y - min_y)) + min_y);

		if (!this._has_character_on_board(character) && this._is_slot_free(this.boardBody[rand_x][rand_y])) {
			character.x = rand_x;
			character.y = rand_y;
			this.boardBody[rand_x][rand_y] = character
			console.log('Spawned character ' + character.char_name + ' on position ' + rand_x + ', ' + rand_y);
		}
		else {
			console.log('Character already on board.')
		}

	}

	Board.prototype.moveCharacter = function(unique_id, x, y) {

		var index = this.seekCharacters.indexOf(unique_id);
		this.characters[index].x = x;
		this.characters[index].y = y;

		return true;
	}

}

module.exports = Board;