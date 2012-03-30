var theCanvas;
var ctx;
var spriteSheet;
var allImageData = []; // 0 is bar, 1 is ball
var bar1;
var bar2;

var _ball;
var _targets = [];
var _bars = [];
var currentPlayer = 1;
var nameRef = new Firebase('http://gamma.firebase.com/stupidpong');


/*
nameRef.on('value', function(snapshot) {
  alert('fred’s first name is ' + snapshot.val());
});*/

function choosePlayer(){
	if(document.playerSelect.player1.checked){
		currentPlayer=1;
	}else{
		currentPlayer=2;
	}
}
function checkCollision(target, ball){
	var left1 = target.x;
	var right1 = target.x + target.width;
	var top1 = target.y;
	var bottom1 = target.y + target.height;

	var left2 = ball.x;
	var right2 = ball.x + ball.width;
	var top2 = ball.y;
	var bottom2 = ball.y + ball.height;

	if(bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2){

	}else{
		console.log('target id:'+target.id);

		var dx = ball.x+(ball.width/2) - target.x-(target.width/2); // diff on x axis
		var dy = ball.y+(ball.height/2) - target.y-(target.height/2);// diff on y axis

		if(dx >= dy) { // point is on top right half from relativeTo
			if(dx >= - dy){
				console.log('EAST');
				ball.x = target.x +target.width;
				ball._xVel = Math.abs(ball._xVel);
				ball._xVel *= ball._elastic;
			}else{
				console.log('NORTH');
				ball.y = target.y-(ball.height);
				ball._yVel = -Math.abs(ball._yVel);
				ball._yVel *= ball._elastic;
			}
		}
		else { // point is on bottom left half from relativeTo
			if(dx >= - dy){
				console.log('SOUTh');
				ball.y = target.y+target.height;
				ball._yVel = Math.abs(ball._yVel);
				ball._yVel *= ball._elastic;
			}else{ 
				console.log('WEST');
				ball.x = target.x - (ball.width);
				ball._xVel = -Math.abs(ball._xVel);
				ball._xVel *= ball._elastic;			
			}
		}
	}
}


function target(id,x,y,width,height){
	this.id = id;
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
	this.checkCollision = checkCollision;
}
function ball(id,x,y){
	this.id = id;
	this._objRadius = 12;
	this.x = x;
	this.y = y;
	this.height = this._objRadius*2;
	this.width = this._objRadius*2;
	this._xVel = Math.random(5);
	this._yVel = 1;	
	this._elastic = 1;
	//this.checkCollision = checkCollision;
}

function onBodyLoad(){
     // init canvas
     theCanvas = document.getElementById('theCanvas');
     ctx = theCanvas.getContext('2d');
     theCanvas.width = 400;
     theCanvas.height = 600;

	// load up images
     for(i=0;i<document.images.length;i++){
        ctx.drawImage(document.images[i],i*document.images[0].width,0);
        
        // get image data
        allImageData.push(ctx.getImageData(i*document.images[0].width,0,document.images[0].width, document.images[0].height));
    }
    
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
	
	// Restore the transform
	ctx.restore();
	
	// set wall targets
	_targets.push(new target('leftWall',-400,0,400,600));
	_targets.push(new target('rightWall',400,0,400,600));
	_bars.push(new target('bar1',135,550,129,24));
	_bars.push(new target('bar2',135,50,129,24));
	
	// add ball
	_ball = new ball('ball',188,278);
}

window.onkeydown = function(e){
	if(e.keyCode=="65"){
		updateBars(currentPlayer,-15);
	}else if(e.keyCode=="68"){
		updateBars(currentPlayer,15);
	}
}

window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
})();

function drawBars(){
	if(currentPlayer=='1'){
		ctx.putImageData(allImageData[0],_bars[0].x,_bars[0].y);
		nameRef.on('player2_x', function(snapshot) {
		  ctx.putImageData(allImageData[0],snapshot.val,_bars[1].y);
		});	
	}else{
		ctx.putImageData(allImageData[0],_bars[1].x,_bars[1].y);
		nameRef.on('player1_x', function(snapshot) {
		  ctx.putImageData(allImageData[0],snapshot.val,_bars[0].y);
		});	
	}
}

function drawBall(){
	if(currentPlayer=='1'){
		ctx.putImageData(allImageData[1],_ball.x,_ball.y);
	}else{
		nameRef.on('ball_x', function(ballx) {
			nameRef.on('ball_y', function(bally) {		
		  		ctx.putImageData(allImageData[0]ballx,bally);
		  });
		});			
	}
}

function collisions(ball){
	for(var j=0;j<_targets.length;j++){
		_targets[j].checkCollision(_targets[j],ball);
		_bars[j].checkCollision(_bars[j],ball);
	}
}

function updateBall(){
	if(_ball.x>420 || _ball.x < -20 || _ball.y>620 || _ball.y< -20){
	
	}else{
		if(currentPlayer=='1'){
			_ball.x += (_ball._xVel);
			_ball.y += (_ball._yVel);
			nameRef.child('ball_x').set(_ball.x);
			nameRef.child('ball_y').set(_ball.y);
			collisions(_ball);
		}
	}
}

function updateBars(player,x){
	var newX;
	if(player=='1'){
		newX = _bars[0].x;
		newX += x;
		//simple check for collision with wall

		if(newX <= -10 || newX+129 >= 400){
			
		}else{
			_bars[0].x = newX;
			nameRef.child('player1_x').set(_bars[0].x);
		}
	}else{
		newX = _bars[1].x;
		newX += x;
		//simple check for collision with wall

		if(newX <= -10 || newX+129 >= 400){
			
		}else{
			_bars[1].x = newX;
			nameRef.child('player2_x').set(_bars[1].x);
		}
	}
}

function render(){
	ctx.save();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, theCanvas.width, theCanvas.height);
	
	drawBars();
	updateBall();
	drawBall();
	ctx.restore();
}

(function animloop(){
      requestAnimFrame(animloop);
      render();
    })();
    
