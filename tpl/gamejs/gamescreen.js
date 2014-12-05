	var game = new Phaser.Game(1728, 1344, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });
	var your_id = null;
	var socket = io.connect();
	var heroes = Array();
	var gameHeroImages = Array();
	var spriteToMove = null;
	var background;
	var gotoX, gotoY = 0;
	var hero_id_turn = null;
	var mouseclicked = false;

	var styleTurnText = { font: "65px Arial", fill: "#ff0044", align: "center" };
	var turnLabel;
	var turnText = '';


	var styleHeroName = { font: "14px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 60, align: "center" };

	function preload() {
		game.stage.disableVisibilityChange = true;
		game.time.advancedTiming = true;
		//  You can fill the preloader with as many assets as your game requires

		//  Here we are loading an image. The first parameter is the unique
		//  string by which we'll identify the image later in our code.

		//  The second parameter is the URL of the image (relative)
		game.load.image('hero', 'hero.png')
		gameHeroImages.push('hero');
		game.load.image('hero2', 'hero2.png')
		gameHeroImages.push('hero2');


		game.load.image('background', 'map.jpg');

	}


	function getRandomHeroImage(gameHeroImages) {
		var random = Math.floor((Math.random() * (gameHeroImages.length)) + 0);
		return gameHeroImages[random];
	}


	var x_blocks = 54
	var y_blocks = 42

	var block_width = 1728/x_blocks;
	var block_height = 1344/y_blocks;

	function Cell(row, column) {
		this.row = row;
		this.column = column;
	}

	function HeroClient(data, sprite, name_label) {
		this.unique_id = data.unique_id;
		this.sprite = sprite;
		this.nickname = data.char_name;
		this.x = data.x;
		this.y = data.y;
		this.name_label = name_label
		//this.image = data.image;
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
				heroes[x].name_label.destroy();
				heroes[x].splice(x, 1);
			}
		}

	});

	socket.on('update-players-array', function (data){
		heroes = Array();
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new HeroClient(data[x], game.add.sprite(data[x].x, data[x].y, 'hero'), game.add.text(0, 0, data[x].nickname, styleHeroName));
			heroes.push(heroclient);
			heroes[heroes.length - 1].sprite.anchor.set(0.5);
			heroes[heroes.length - 1].name_label.anchor.set(0.5);
			game.physics.arcade.enable(heroes[heroes.length - 1].sprite);
		}

	});

	socket.on('update-players-array-socket', function (data){
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new HeroClient(data[x], game.add.sprite(data[x].x, data[x].y, 'hero'), game.add.text(0, 0, data[x].char_name, styleHeroName));
			heroes.push(heroclient);
			heroes[heroes.length - 1].sprite.anchor.set(0.5);
			heroes[heroes.length - 1].name_label.anchor.set(0.5);
			game.physics.arcade.enable(heroes[heroes.length - 1].sprite);
		}
	});

	socket.on('add-new-player', function (data){
		//EXPERIMENTAL, ADICIONANDO NOME NO HERO
		var heroclient = new HeroClient(data, game.add.sprite(data.x, data.y, 'hero'), game.add.text(0, 0, data.char_name, styleHeroName));
		heroes.push(heroclient);
		heroes[heroes.length - 1].sprite.anchor.set(0.5);
		heroes[heroes.length - 1].name_label.anchor.set(0.5);
		game.physics.arcade.enable(heroes[heroes.length - 1].sprite);

		console.log(heroes);
	});

	socket.on('hero-update', function (data) {
		for (var x = 0; x < heroes.length; x++) {
			if (data.unique_id == heroes[x].unique_id) {
				spriteToMove = heroes[x];
				gotoX = data.x;
				gotoY = data.y;
				break;
			}
		}
	});

	socket.on('your-id', function (data) {
		your_id = data.your_id;
		hero_id_turn = data.player_turn_id;
		console.log(data);
	});

	socket.on('move-queue', function (data) {
		hero_id_turn = data;
		console.log('Turn mudou para: '+ hero_id_turn);
	});


	function create() {
		mouseclicked = false;
		//gotoX = game.world.centerX;
		//gotoY = game.world.centerY;
		//	Trying to make the game run even if screen is not focused

		if (localStorage.getItem("nickname") == '' || localStorage.getItem("nickname") == null) {
			var nick = prompt('Enter your nickname');
			localStorage.setItem("nickname", nick);
		}

		var nickname = localStorage.getItem("nickname");
		socket.emit('new-player', {'nickname': nickname});

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


		//	Added turn text
		turnLabel = game.add.text(game.world.centerX, game.world.centerY-200, turnText, styleTurnText);
		turnLabel.anchor.set(0.5, 0.5);
	}

	function update () {
		if (game.input.mousePointer.isUp) {
			mouseclicked = false;
		}

		if (game.input.mousePointer.justPressed() && !mouseclicked) {
			mouseclicked = true;
			//getCursorPosition(gotoX, gotoY);
			socket.emit('hero-move', {'x': game.input.mousePointer.x, 'y': game.input.mousePointer.y});

		}


		if (your_id == hero_id_turn && turnLabel.text != "Your turn") {
			turnLabel.setText("Your turn");
		}
		else if (your_id != hero_id_turn && turnLabel.text != "Other player turn") {
			turnLabel.setText("Other player turn");
		}



		if (heroes.length > 0) {

			for (var x = 0; x < heroes.length; x++) {
				heroes[x].name_label.x = Math.floor((heroes[x].sprite.x + heroes[x].sprite.width / 2)-13);
				heroes[x].name_label.y = Math.floor((heroes[x].sprite.y + heroes[x].sprite.height / 2) - 50);
			}

		}


		if (spriteToMove != null) {
			//text.x = Math.floor((spriteToMove.sprite.x + spriteToMove.sprite.width / 2)-13);
    		//text.y = Math.floor((spriteToMove.sprite.y + spriteToMove.sprite.height / 2) - 50);

			if (game.physics.arcade.distanceToXY(spriteToMove.sprite, gotoX, gotoY) > 8) {

				if (game.physics.arcade.distanceToXY(spriteToMove.sprite, gotoX, spriteToMove.sprite.y) > 8) {
					//spriteToMove.name_label.x = Math.floor(spriteToMove.sprite.x + spriteToMove.sprite.width / 2);
					game.physics.arcade.moveToXY(spriteToMove.sprite, gotoX, spriteToMove.sprite.y, 250);
				}

				if (game.physics.arcade.distanceToXY(spriteToMove.sprite, spriteToMove.sprite.x, gotoY) > 8) {
					//spriteToMove.name_label.y = Math.floor(spriteToMove.y + spriteToMove.sprite.height / 2);
					game.physics.arcade.moveToXY(spriteToMove.sprite, spriteToMove.sprite.x, gotoY,250);
				}

			}
			else {
				spriteToMove.sprite.body.velocity.set(0);
				spriteToMove = null;
			}
		}

	}

		function render () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		}
