$(document).ready(function(){
	var socket = io.connect();
	var heroes = Array();
	


	// Create the canvas
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 512;
	canvas.height = 480;


	var gridBlockWidth = 40;
	var gridBlockHeight = 40;

	document.body.appendChild(canvas);



	function Cell(row, column, clickx, clicky) {
	    this.row = row;
	    this.column = column;
	    this.clickx = clickx;
	    this.clicky = clicky;
	}

	function getCursorPosition(e) {
	    /* returns Cell with .row and .column properties */
	    var x;
	    var y;
	    if (e.pageX != undefined && e.pageY != undefined) {
			x = e.pageX;
			y = e.pageY;
	    }
	    else {
			x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	    }

	    x -= canvas.offsetLeft;
	    y -= canvas.offsetTop;
	    x = Math.min(x, canvas.width * gridBlockWidth);
	    y = Math.min(y, canvas.height * gridBlockHeight);
	    var cell = new Cell(Math.floor(y/gridBlockHeight), Math.floor(x/gridBlockWidth), x, y);
	    console.log(cell);
	    socket.emit('sendClick', cell);
	    //return cell;
	}





	//grid width and height
	var bw = 440;
	var bh = 400;
	//padding around grid
	var p = 35;
	//size of canvas
	var cw = bw + (p*2) + 1;
	var ch = bh + (p*2) + 1;

	function drawBoard(){
	    for (var x = 0; x <= bw; x += gridBlockWidth) {
	        ctx.moveTo(0.5 + x + p, p);
	        ctx.lineTo(0.5 + x + p, bh + p);
	    }


	    for (var x = 0; x <= bh; x += gridBlockHeight) {
	        ctx.moveTo(p, 0.5 + x + p);
	        ctx.lineTo(bw + p, 0.5 + x + p);
	    }

	    ctx.strokeStyle = "black";
	    ctx.stroke();
	}

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
			socket.emit('sendInput', {'key': 'up', 'modifier': modifier});
		}
		if (40 in keysDown) { // Player holding down
			socket.emit('sendInput', {'key': 'down', 'modifier': modifier});
		}
		if (37 in keysDown) { // Player holding left
			socket.emit('sendInput', {'key': 'left', 'modifier': modifier});
		}
		if (39 in keysDown) { // Player holding right
			socket.emit('sendInput', {'key': 'right', 'modifier': modifier});
		}
	};

	// Reset the game when the player catches a monster
	var reset = function () {
		for (var x = 0; x < heroes.length; x++) {
			heroes[x].x = canvas.width / 2;
			heroes[x].y = canvas.height / 2;
		}
		
	};

	// Draw everything
	var render = function (heroes) {
		//drawBoard();

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

		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		drawBoard();

		update(delta / 1000);
		render(heroes);

		then = now;
		// Request to do this again ASAP
		requestAnimationFrame(main);
	};

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
	canvas.addEventListener("click", getCursorPosition, false);
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