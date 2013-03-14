// setup object
var setup = {
	//some stuff for mobile
	WIDTH: 320;
	HEIGHT: 480;
	RATIO: null;
	currWidth: null;
	currHeight: null;
	canvas: null;
	ctx: null;

	init: function(){
		this.RATIO = this.WIDTH/this.HEIGHT;
		this.currWidth = this.WIDTH;
		this.currHeight = this.HEIGHT;
		this.canvas = document.getElementById("bg");
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = canvas.getContext("2d");
		this.resize();
	};

	resize: function(){
		this.currHeight = window.innerHeight;
		this.currHeight = this.currHeight * this.RATIO;
		//resize in css
		this.canvas.style.width = this.currentWidth + 'px';
	    this.canvas.style.height = this.currentHeight + 'px';

	    //sometimes events don't fire if there isn't a timeout 
	    //for mobile browsers
	    window.setTimeout(function() {
	                window.scrollTo(0,1);
	    }, 1);

	};
};
window.addEventListener('load', setup.init, false);
window.addEventListener('resize', setup.resize, false);