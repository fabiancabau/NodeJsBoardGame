$(document).ready(function(){
	var socket = io.connect();
	var heroes = Array();

	var myHero = {};
	var old_hero_pos = {};
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

	    socket.emit('sendClick', {'cell': cell, 'old_hero_pos_x': old_hero_pos.x, 'old_hero_pos_y': old_hero_pos.y });
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

	var bgHero = new Image();
	bgHero.src = "hero.png";



	function createHero(hero) {
		// Hero image
		hero.ready = false;
		hero.image = new Image();
		hero.image.onload = function () {
			hero.ready = true;
		};
		hero.image.src = "hero.png";
		hero.speed = 256 // movement in pixels per second

		return hero;
	}

	// Draw heroes
	var render = function (heroes) {

		ctx.drawImage(bgHero, myHero.x, myHero.y);

		// Score
		ctx.fillStyle = "rgb(250, 250, 250)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Players online: " + heroes.length, 32, 32);
	};


	var moveHero = function(x, y, delta) {
		myHero.x += x * delta;
		myHero.y += y * delta;
	}

	var moveHero = function(x, y, delta) {


		if (old_hero_pos.x > x) {
			myHero.x -= x * delta;
		}
		else if (old_hero_pos.x < x) {
			myHero.x += x * delta;
		}

		if (myHero.x == x) {

			if (old_hero_pos.y > y) {
				myHero.y -= y * delta;
			}
			else if (old_hero_pos.y < y) {
				myHero.y += y * delta;
			}

		}
	}

	lastTime = (new Date()).getTime(),
	currentTime = 0,
	delta = 0;

	// Cross-browser support for requestAnimationFrame
	var w = window;
	requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
	canvas.addEventListener("click", getCursorPosition, false);

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		currentTime = (new Date()).getTime();
		delta = (currentTime - lastTime) / 1000;

		if (bgReady) {
			ctx.drawImage(bgImage, 0, 0);
		}

		drawBoard();

		moveHero(myHero.x, myHero.y, delta);
		render(heroes);

		lastTime = currentTime;
	}


	gameLoop();


	var nickname = prompt("Entre com seu nick : ", "");
   	socket.emit('new player', {p: nickname});

   	socket.on('myHero', function (hero) {
			myHero.x = hero.hero.x;
			myHero.y = hero.hero.y;

			old_hero_pos.x = hero.old_hero_pos.x;
			old_hero_pos.y = hero.old_hero_pos.y;
   	});

   	socket.on('update players', function (_p) {
			heroes = Array();
		  heroes.push(createHero(_p[0]));
			myHero = createHero(_p[0]);
	    render(heroes);
   		/*heroes = Array();
   		for (var i = 0; i < _p.length; i++) {
   			heroes.push(createHero(_p[i]));
   			render(heroes);
   		}*/
    });

});
