	var game = new Phaser.Game(1728, 1344, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	var socket = io.connect();
	var heroes = Array();

	var spriteToMove = null;
	var background;
	var gotoX, gotoY = 0;

	function preload() {

		//  You can fill the preloader with as many assets as your game requires

		//  Here we are loading an image. The first parameter is the unique
		//  string by which we'll identify the image later in our code.

		//  The second parameter is the URL of the image (relative)
		game.load.image('phaser', 'hero.png');
		game.load.image('background', 'map.jpg');

	}



	var x_blocks = 54
	var y_blocks = 42

	var block_width = 1728/x_blocks;
	var block_height = 1344/y_blocks;

	function Cell(row, column) {
		this.row = row;
		this.column = column;
	}

	function HeroClient(data, sprite) {
		this.unique_id = data.unique_id;
		this.sprite = sprite;
		this.nickname = data.char_name;
		this.x = data.x;
		this.y = data.y;
	}

	function getCursorPosition(x, y) {
		x -= game.canvas.offsetLeft;
		y -= game.canvas.offsetTop;
		x = Math.min(x, 1728 * block_width);
		y = Math.min(y, 1344 * block_height);
		var cell = new Cell(Math.floor(y/block_height), Math.floor(x/block_width));
		console.log(cell);
		//socket.emit('sendClick', cell);
		//return cell;
	}

	socket.on('player-disconnected', function (data){
		for (var x = 0; x  < heroes.length; x++) {
			if (heroes[x].unique_id == data) {
				heroes[x].sprite.destroy();
				heroes[x].splice(x, 1);
			}
		}

	});

	socket.on('update-players-array', function(data){
		heroes = Array();
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new HeroClient(data[x], game.add.sprite(data[x].x, data[x].y, 'phaser'));
			heroes.push(heroclient);
			heroes[heroes.length - 1].sprite.anchor.set(0.5);
			game.physics.arcade.enable(heroes[heroes.length - 1].sprite);
		}

	});

	socket.on('update-players-array-socket', function(data){
		heroes = Array();
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new HeroClient(data[x], game.add.sprite(data[x].x, data[x].y, 'phaser'));
			heroes.push(heroclient);
			heroes[heroes.length - 1].sprite.anchor.set(0.5);
			game.physics.arcade.enable(heroes[heroes.length - 1].sprite);
		}
	});

	socket.on('add-new-player', function(data){
			var heroclient = new HeroClient(data, game.add.sprite(data.x, data.y, 'phaser'));
			heroes.push(heroclient);
			heroes[heroes.length - 1].sprite.anchor.set(0.5);
			game.physics.arcade.enable(heroes[heroes.length - 1].sprite);
	});

	socket.on('hero-update', function (data) {
		for (var x = 0; x < heroes.length; x++) {
			if (data.unique_id == heroes[x].unique_id) {
				spriteToMove = heroes[x].sprite;
				gotoX = data.x;
				gotoY = data.y;

				console.log('Sprite to move: ' + heroes[x].nickname);
				console.log('Moving to: ' + gotoX + '-' + gotoY );
				break;
			}
		}
	});

	//var sprite;



	function create() {
		//gotoX = game.world.centerX;
		//gotoY = game.world.centerY;
		mouseclicked = false;

		var nickname = 'Hero '+ (heroes.length + 1);
		socket.emit('new-player', {'nickname': nickname});

		//  To make the sprite move we need to enable Arcade Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//
		game.stage.disableVisibilityChange = true;

		//	Create a background image
		background = game.add.sprite(0, 0, 'background');

		//	Enable input to it so we can grab click events
		background.inputEnabled = true;

		//	pixelPerfectClick is expensive but totally needed
		background.input.pixelPerfectClick = true;

		//	Hand Cursor is nicer than normal, no? :)
		background.input.useHandCursor = true;

		//	Add the hero sprite to the world (we're gonna use a for loop to add N heroes)
		//sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		//sprite.anchor.set(0.5);

		//  And enable the Sprite to have a physics body:


	}

	function update () {


		//	Check if the mouse is clicked
		if (game.input.mousePointer.isUp) {
			mouseclicked = false;
		}

		//	On click, set the target X and Y and set mouse clicked to true so you can't drag it around
		if (game.input.mousePointer.isDown && !mouseclicked) {
			mouseclicked = true;
			console.log(heroes);
			socket.emit('hero-move', {'x': game.input.mousePointer.x, 'y': game.input.mousePointer.y});
			console.log(heroes);
			//getCursorPosition(gotoX, gotoY);
		}


		if (spriteToMove != null) {
			if (game.physics.arcade.distanceToXY(spriteToMove, gotoX, gotoY) > 8) {

				if (game.physics.arcade.distanceToXY(spriteToMove, gotoX, spriteToMove.y) > 8) {
					game.physics.arcade.moveToXY(spriteToMove, gotoX, spriteToMove.y, 200);
				}

				if (game.physics.arcade.distanceToXY(spriteToMove, spriteToMove.x, gotoY) > 8) {
					game.physics.arcade.moveToXY(spriteToMove, spriteToMove.x, gotoY, 200);
				}

			}
			else {
				spriteToMove.body.velocity.set(0);
				spriteToMove = null;
			}
		}

	}

		function render () {

			game.debug.inputInfo(16, 16);

		}
