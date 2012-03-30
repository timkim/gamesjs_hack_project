var theCanvas;
var ctx;
var spriteSheet;
var allImageData = [];

function onBodyLoad(){
     // draw images 
     theCanvas = document.getElementById('theCanvas');
     ctx = theCanvas.getContext('2d');
     theCanvas.width = document.images.length * document.images[0].width;
     theCanvas.height = 3 * document.images[0].height;
     for(i=0;i<document.images.length;i++){
        ctx.drawImage(document.images[i],i*document.images[0].width,0);
        
        // get image data
        allImageData.push(ctx.getImageData(i*document.images[0].width,0,document.images[0].width, document.images[0].height));
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

function render(){
	
}

(function animloop(){
      requestAnimFrame(animloop);
      render();
    })();
    
