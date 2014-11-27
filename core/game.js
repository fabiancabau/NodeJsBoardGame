var c1 = new Character(01, "Char1", 100, 100, 10, 10, 10, 0.1, 0.2);
var c2 = new Character(02, "Char2", 100, 100, 10, 10, 10, 0.1, 0.2);
var board = new Board(30, 30, 5, 0);

board.addCharacter(c1);
board.addCharacter(c2);
board.addCharacter(c1);
board.addCharacter(c1);
board.addCharacter(c2);
board.addCharacter(c1);



board.spawnCharacter(board.characters[0], TEAM_GOODGUYS);
board.spawnCharacter(board.characters[1], TEAM_BADGUYS);

board.moveCharacter(board.characters[0], LEFT, 1);