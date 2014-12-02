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