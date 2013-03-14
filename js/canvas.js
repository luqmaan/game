var canvas = null;
var ctx = null;
var img = null;

var onImageLoad = function(){
	console.log("Image loaded");
	ctx.drawImage(img, 200,200);
};

var setup = function(){
	var body = document.getElementById("mycanvas");
	canvas = document.createElement("canvas");

	ctx = canvas.getContext("2d");

	canvas.setAttribute("width", 400);
	canvas.setAttribute("height", 400);

	body.appendChild(canvas);

	img = new Image();
	img.onload = onImageLoad();
	img.src = "tilesets/BombermanDojo.png";

};

setup();