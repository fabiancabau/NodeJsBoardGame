$(document).ready(function(){
	var socket = io.connect();
	var heroes = Array();
	//GAME VARS
	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 512;
	canvas.height = 480;
	document.body.appendChild(canvas);

	// Background image
	var bgReady = false;
	var bgImage = new Image();
	bgImage.onload = function () {
		bgReady = true;
	};
	bgImage.src = "background.png";

	function createHero(hero) {
		// Hero image
		hero.ready = false;
		hero.image = new Image();
		hero.image.onload = function () {
			hero.ready = true;
		};
		hero.image.src = "hero.png";
		// Game objects
		hero.speed = 256 // movement in pixels per second

		return hero;
	}	

	// Handle keyboard controls
	var keysDown = {};

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
	}, false);

	// Update game objects
	var update = function (modifier) {
		if (38 in keysDown) { // Player holding up
			//myHero.y -= myHero.speed * modifier;
			//socket.emit('updateHeroPos', {'x': Math.round(myHero.x), 'y': Math.round(myHero.y), 'unique_id': myHero.unique_id});
			socket.emit('sendInput', {'key': 'up', 'modifier': modifier});
		}
		if (40 in keysDown) { // Player holding down
			//myHero.y += myHero.speed * modifier;
			//socket.emit('updateHeroPos', {'x': Math.round(myHero.x), 'y': Math.round(myHero.y), 'unique_id': myHero.unique_id});
			socket.emit('sendInput', {'key': 'down', 'modifier': modifier});
		}
		if (37 in keysDown) { // Player holding left
			//myHero.x -= myHero.speed * modifier;
			//socket.emit('updateHeroPos', {'x': Math.round(myHero.x), 'y': Math.round(myHero.y), 'unique_id': myHero.unique_id});
			socket.emit('sendInput', {'key': 'left', 'modifier': modifier});
		}
		if (39 in keysDown) { // Player holding right
			//myHero.x += myHero.speed * modifier;
			//socket.emit('updateHeroPos', {'x': Math.round(myHero.x), 'y': Math.round(myHero.y), 'unique_id': myHero.unique_id});
			socket.emit('sendInput', {'key': 'right', 'modifier': modifier});
		}
	};

	// Reset the game when the player catches a monster
	var reset = function () {
		for (var x = 0; x < heroes.length; x++) {
			heroes[x].x = canvas.width / 2;
			heroes[x].y = canvas.height / 2;
			// Throw the monster somewhere on the screen randomly
			//monster.x = 32 + (Math.random() * (canvas.width - 64));
			//monster.y = 32 + (Math.random() * (canvas.height - 64));
		}
		
	};

	// Draw everything
	var render = function (heroes) {
		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		for (var i = 0; i < heroes.length; i++) { 
			if (heroes[i].ready) {
				ctx.drawImage(heroes[i].image, heroes[i].x, heroes[i].y);
			}
		}

		// Score
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Players online: " + heroes.length, 32, 32);
	};

	// The main game loop
	var main = function () {
		var now = Date.now();
		var delta = now - then;

		update(delta / 1000);
		render(heroes);

		then = now;
		// Request to do this again ASAP
		requestAnimationFrame(main);
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

	// Let's play this game!
	var then = Date.now();
	reset();
	main();


	
	var myHero = {};

	var nickname = prompt("Entre com seu nick : ", "");
   	socket.emit('new player', {p: nickname});

   	socket.on('myHero', function (hero) {
   		myHero = hero;
   	});

   	socket.on('update players', function (_p) {
   		heroes = Array();
   		for (var i = 0; i < _p.length; i++) {
   			heroes.push(createHero(_p[i]));
   			render(heroes);
   		}
    });

});