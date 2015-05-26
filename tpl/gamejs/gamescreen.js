	var styleHeroName = { font: "14px Arial", fill: "#FFFFFF", wordWrap: true, wordWrapWidth: 60, align: "center" };


	Hero = function (game, unique_id, nickname, x, y, facing, heroImgPos) {

	    Phaser.Sprite.call(this, game, x, y, 'walkinghero');

	    this.unique_id = unique_id;
		this.nickname = nickname;
		this.x = x;
		this.y = y;
		this.name_label = game.add.text(0, 0, this.nickname, styleHeroName);
		this.facing = facing;
		this.heroImgPos = heroImgPos;
		this.moving = false;

		this.next_x = 0;
		this.next_y = 0;

	    this.anchor.setTo(0.5);

		this.animations.add('walk-down', this.heroImgPos.walk_down);
		this.animations.add('walk-left', this.heroImgPos.walk_left);
		this.animations.add('walk-right', this.heroImgPos.walk_right);
		this.animations.add('walk-up', this.heroImgPos.walk_up);
		this.name_label.anchor.set(0.5);

	    game.add.existing(this);
	    game.physics.arcade.enable(this);

	};

	Hero.prototype = Object.create(Phaser.Sprite.prototype);
	Hero.prototype.constructor = Hero;

	Hero.prototype.update = function() {

		if (this.moving == true) {

			if (this.facing == 0) {
				this.animations.play('walk-up', 20, true);
				console.log('walking up');
			}
			if (this.facing == 1) {
				this.animations.play('walk-right', 20, true);
				console.log('walking right');
			}
			if (this.facing == 2) {
				this.animations.play('walk-down', 20, true);
				console.log('walking down');
			}
			if (this.facing == 3) {
				this.animations.play('walk-left', 20, true);
				console.log('walking left');
			}


			
			if (game.physics.arcade.distanceToXY(this, this.next_x, this.next_y) > 15) {

				if (game.physics.arcade.distanceToXY(this, this.next_x, this.y) > 15) {
					game.physics.arcade.moveToXY(this, this.next_x, this.y, 100);

					if (this.next_x > this.x) {
						this.facing = 1;
					}
					if (this.next_x < this.x) {
						this.facing = 3;
					}
				}
				else if (game.physics.arcade.distanceToXY(this, this.x, this.next_y) > 15) {
					game.physics.arcade.moveToXY(this, this.x, this.next_y, 100);

					if (this.next_y > this.y) {
						this.facing = 2;
					}
					if (this.next_y < this.y) {
						this.facing = 0;
					}

				}

			}
			else {
				this.animations.stop(null, true);
				this.body.velocity.set(0);
				this.moving = false;
				this.next_x = 0;
				this.next_y = 0;
				console.log('Stopped Walking');
				console.log(this);

			}


		}
	    //  Automatically called by World.update
	    //this.angle += 0.2;

	};




	var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

	var your_id = null;
	var socket = io.connect();
	var heroes = Array();
	var spriteToMove = null;
	var background;
	var gotoX, gotoY = 0;
	var hero_id_turn = null;
	var mouseclicked = false;

	var styleTurnText = { font: "65px Arial", fill: "#ff0044", align: "center" };
	var turnLabel;
	var turnText = '';


	function preload() {
		game.stage.disableVisibilityChange = true;
		game.time.advancedTiming = true;
		//  You can fill the preloader with as many assets as your game requires

		//  Here we are loading an image. The first parameter is the unique
		//  string by which we'll identify the image later in our code.

		//  The second parameter is the URL of the image (relative)
		//game.load.image('hero', 'hero.png')
		//gameHeroImages.push('hero');
		game.load.spritesheet('walkinghero', 'sprites.png', 48, 64, 96);


		game.load.image('background', 'map.jpg');

	}

	var x_blocks = 54;
	var y_blocks = 42;

	var block_width = 1728/x_blocks;
	var block_height = 1344/y_blocks;

	function Cell(row, column) {
		this.row = row;
		this.column = column;
	}

	function HeroClient(data, sprite, name_label, heroImgPos) {
		this.unique_id = data.unique_id;
		this.sprite = sprite;
		this.nickname = data.nickname;
		this.x = data.x;
		this.y = data.y;
		this.name_label = name_label;
		this.facing = 2;
		this.heroImgPos = heroImgPos;
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


	function addHeroAnimations(hero) {

	}

	socket.on('player-disconnected', function (data){
		for (var x = 0; x  < heroes.length; x++) {
			if (heroes[x].unique_id == data) {
				heroes[x].destroy();
				heroes[x].name_label.destroy();
				heroes[x].splice(x, 1);
			}
		}

	});

	socket.on('update-players-array', function (data){
		heroes = Array();
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new Hero(game, data[x].unique_id, data[x].nickname, data[x].x, data[x].y, 2, data[x].heroImgPos);
			heroes.push(heroclient);
		}

	});

	socket.on('update-players-array-socket', function (data){
		for (var x = 0; x  < data.length; x++) {
			var heroclient = new Hero(game, data[x].unique_id, data[x].nickname, data[x].x, data[x].y, 2, data[x].heroImgPos);
			heroes.push(heroclient);
		}
	});

	socket.on('add-new-player', function (data){
		var heroclient = new Hero(game, data.unique_id, data.nickname, data.x, data.y, 2, data.heroImgPos);
		heroes.push(heroclient);

		console.log(heroes);
	});

	socket.on('hero-update', function (data) {
		console.log('hero update');
		console.log(data);
		for (var x = 0; x < heroes.length; x++) {

			console.log(heroes[x]);

			if (data.unique_id == heroes[x].unique_id) {

				heroes[x].moving = true;
				heroes[x].next_x = data.x;
				heroes[x].next_y = data.y;

				spriteToMove = heroes[x];
				console.log('spriteToMove');
				console.log(spriteToMove);
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

	// socket.on('move-queue', function (data) {
	// 	hero_id_turn = data;
	// 	console.log('Turn mudou para: '+ hero_id_turn);
	// });


	function create() {
		mouseclicked = false;

		if (localStorage.getItem("nickname") == '' || localStorage.getItem("nickname") == null) {
			var nick = prompt('Enter your nickname');
			localStorage.setItem("nickname", nick);
		}

		var nickname = localStorage.getItem("nickname");
		socket.emit('new-player', {'nickname': nickname});


		game.plugins.add(Phaser.Plugin.SaveCPU);
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
		//turnLabel = game.add.text(game.world.centerX, game.world.centerY-200, turnText, styleTurnText);
		//turnLabel.anchor.set(0.5, 0.5);
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


		// if (your_id == hero_id_turn && turnLabel.text != "Your turn") {
		// 	turnLabel.setText("Your turn");
		// }
		// else if (your_id != hero_id_turn && turnLabel.text != "Other player turn") {
		// 	turnLabel.setText("Other player turn");
		// }



		//if (heroes.length > 0) {
        //
		//	for (var x = 0; x < heroes.length; x++) {
		//		heroes[x].name_label.x = Math.floor((heroes[x].x + heroes[x].width / 2) - 22);
		//		heroes[x].name_label.y = Math.floor((heroes[x].y + heroes[x].height / 2) - 60);
		//	}
        //
		//}


		//if (spriteToMove != null) {
        //
		//	console.log(spriteToMove.facing);
        //
		//	if (spriteToMove.facing == 0) {
		//		spriteToMove.animations.play('walk-up', 20, true);
		//	}
		//	if (spriteToMove.facing == 1) {
		//		spriteToMove.animations.play('walk-right', 20, true);
		//	}
		//	if (spriteToMove.facing == 2) {
		//		spriteToMove.animations.play('walk-down', 20, true);
		//	}
		//	if (spriteToMove.facing == 3) {
		//		spriteToMove.animations.play('walk-left', 20, true);
		//	}
        //
		//	//spriteToMove.sprite.animations.play('walk-down', 20, true);
		//	if (game.physics.arcade.distanceToXY(spriteToMove, gotoX, gotoY) > 8) {
        //
		//		if (game.physics.arcade.distanceToXY(spriteToMove, gotoX, spriteToMove.y) > 8) {
		//			game.physics.arcade.moveToXY(spriteToMove, gotoX, spriteToMove.y, 100);
        //
		//			if (gotoX > spriteToMove.x) {
		//				spriteToMove.facing = 1;
		//			}
		//			if (gotoX < spriteToMove.x) {
		//				spriteToMove.facing = 3;
		//			}
		//		}
		//		else if (game.physics.arcade.distanceToXY(spriteToMove, spriteToMove.x, gotoY) > 8) {
		//			game.physics.arcade.moveToXY(spriteToMove, spriteToMove.x, gotoY,100);
        //
		//			if (gotoY > spriteToMove.y) {
		//				spriteToMove.facing = 2;
		//			}
		//			if (gotoY < spriteToMove.y) {
		//				spriteToMove.facing = 0;
		//			}
        //
		//		}
        //
		//	}
		//	else {
		//		spriteToMove.animations.stop(null, true);
		//		spriteToMove.body.velocity.set(0);
		//		spriteToMove = null;
		//	}
		//}

	}

		function render () {
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
		}
