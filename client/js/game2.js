
//maybe this can be done serverside?
function AssetManager(){
  this.successCount = 0;
  this.errorCount = 0;
  this.cache = {};
  this.downloadQueue = [];

}

AssetManager.prototype.queueDownload = function(path){
  this.downloadQueue.push(path);
}

AssetManager.prototype.isDone = function(){
  return (this.downloadQueue.length == this.successCount + this.errorCount);
}

AssetManager.prototype.downloadAll = function(callback){
  for(var i = 0, i < downloadQueue.length; i++){
    var path = this.downloadQueue[i];
    var img = new Image();
    var that = this;
    img.addEventListener("load", function(){
      that.successCount += 1;
      if (that.isDone()){
        callback();
      }
    });
    img.addEventListener("error", function(){
      that.errorCount += 1;
      if(that.isDone()){
        callback();
      }
    });
  }
}


//Renderer bg
ASSET_MANAGER.queueDownload('images/bird.png');
ASSET_MANAGER.downloadAll(function(){
  var x = 0, y = 0;
  var sprite = ASSET_MANAGER.getAsset('images/bird.png');

  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.drawImage(sprite, x-sprite.width/2,y-sprite.height/2);
});


//game engine
GameEngine.prototype.loop = function(){
  var now = Date.now();
  this.deltaTime = now - this.lastUpdateTimestamp;
  this.update();
  this.draw();
  this.lastUpdateTimestamp = now;
}

//test
GameEngine.prototype.start = function(){
  console.log("starting game");
  this.lastUpdateTimestamp = Date.now();
  var that = this;
  (function gameLoop(){
    that.loop();
    requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
 }
