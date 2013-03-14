// // MobileCanvas object
// var MobileCanvas = {
// 	//some stuff for mobile
// 	WIDTH: 320,
// 	HEIGHT: 480,
// 	RATIO: null,
// 	currWidth: null,
// 	currHeight: null,
// 	canvas: null,
// 	ctx: null,

// 	init: function(){
// 		MobileCanvas.RATIO = MobileCanvas.WIDTH/MobileCanvas.HEIGHT;
// 		MobileCanvas.currWidth = MobileCanvas.WIDTH;
// 		MobileCanvas.currHeight = MobileCanvas.HEIGHT;
// 		MobileCanvas.canvas = document.getElementById("mobile");
// 		MobileCanvas.canvas.width = MobileCanvas.WIDTH;
// 		MobileCanvas.canvas.height = MobileCanvas.HEIGHT;
// 		MobileCanvas.ctx = MobileCanvas.canvas.getContext("2d");

// 		MobileCanvas.resize();
// 	},

// 	resize: function(){
// 		MobileCanvas.currHeight = window.innerHeight;
// 		MobileCanvas.currHeight = MobileCanvas.currHeight * MobileCanvas.RATIO;

// 	    //sometimes events don't fire if there isn't a timeout 
// 	    //for mobile browsers
// 	    window.setTimeout(function() {
// 	                window.scrollTo(0,1);
// 	    }, 1);

// 	},
// };
// window.addEventListener('load', MobileCanvas.init, false);
// window.addEventListener('resize', MobileCanvas.resize, false);

// Normal Canvas object (tablet object landscape)
var Canvas = {
	//some stuff for tablet
	WIDTH: 944,
	HEIGHT: 766,
	RATIO: null,
	currWidth: null,
	currHeight: null,
	canvas: null,
	ctx: null,

	init: function(){
		Canvas.RATIO = Canvas.WIDTH/Canvas.HEIGHT;
		Canvas.currWidth = Canvas.WIDTH;
		Canvas.currHeight = Canvas.HEIGHT;
		Canvas.canvas = document.getElementById("tablet");
		Canvas.canvas.width = Canvas.WIDTH;
		Canvas.canvas.height = Canvas.HEIGHT;
		Canvas.ctx = Canvas.canvas.getContext("2d");
	}
	
};
window.addEventListener('load', Canvas.init, false);