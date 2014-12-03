	var game = new Phaser.Game(1728, 1344, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	var socket = io.connect();
	var heroes = Array();
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

	var sprite;
	var background;
	var gotoX, gotoY = 0;


	function create() {
		gotoX = game.world.centerX;
		gotoY = game.world.centerY;
		mouseclicked = false;

		//  To make the sprite move we need to enable Arcade Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//	Create a background image
		background = game.add.sprite(0, 0, 'background');

		//	Enable input to it so we can grab click events
		background.inputEnabled = true;

		//	pixelPerfectClick is expensive but totally needed
		background.input.pixelPerfectClick = true;

		//	Hand Cursor is nicer than normal, no? :)
		background.input.useHandCursor = true;

		//	Add the hero sprite to the world (we're gonna use a for loop to add N heroes)
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		sprite.anchor.set(0.5);

		//  And enable the Sprite to have a physics body:
		game.physics.arcade.enable(sprite);

	}

	function update () {


		//	Check if the mouse is clicked
		if (game.input.mousePointer.isUp) {
			mouseclicked = false;
		}

		//	On click, set the target X and Y and set mouse clicked to true so you can't drag it around
		if (game.input.mousePointer.isDown && !mouseclicked) {
			mouseclicked = true;
			gotoX = game.input.mousePointer.x;
			gotoY = game.input.mousePointer.y;
			getCursorPosition(gotoX, gotoY);
		}

		if (game.physics.arcade.distanceToXY(sprite, gotoX, gotoY) > 8) {

			if (game.physics.arcade.distanceToXY(sprite, gotoX, sprite.y) > 8) {
				game.physics.arcade.moveToXY(sprite, gotoX, sprite.y, 200);
			}

			if (game.physics.arcade.distanceToXY(sprite, sprite.x, gotoY) > 8) {
				game.physics.arcade.moveToXY(sprite, sprite.x, gotoY, 200);
			}

		}
		else {
			sprite.body.velocity.set(0);
		}

	}

		function render () {

			game.debug.inputInfo(16, 16);

		}
