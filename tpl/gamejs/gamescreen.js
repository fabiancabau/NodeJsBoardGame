	var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

	function preload() {

		//  You can fill the preloader with as many assets as your game requires

		//  Here we are loading an image. The first parameter is the unique
		//  string by which we'll identify the image later in our code.

		//  The second parameter is the URL of the image (relative)
		game.load.image('phaser', 'hero.png');
		game.load.image('background', 'map.jpg');

	}



	var sprite;
	var background;
	var gotoX, gotoY = 0;


	function create() {
		gotoX = game.world.centerX;
		gotoY = game.world.centerY;

		//  To make the sprite move we need to enable Arcade Physics
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//	Create a background image
		background = game.add.sprite(0, 0, 'background');

		//	Enable input to it so we can grab click events
		background.inputEnabled = true;

		//	pixelPerfectClick is expensive but totally needed
		game.input.pixelPerfectClick = true;

		//	Hand Cursor is nicer than normal, no? :)
		background.input.useHandCursor = true;

		//	Add the hero sprite to the world (we're gonna use a for loop to add N heroes)
		sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');
		sprite.anchor.set(0.5);

		//  And enable the Sprite to have a physics body:
		game.physics.arcade.enable(sprite);

	}

	function update () {

		//On click, set the target X and Y
		if (game.input.mousePointer.isDown) {
			gotoX = game.input.mousePointer.x;
			gotoY = game.input.mousePointer.y;
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

			game.debug.inputInfo(32, 32);

		}
