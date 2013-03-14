
var gSpriteSheets = {};

SpriteSheetClass = Class.extend({
	img: null,
	url: "",
	sprites: new Array(),

	init: function () {},

	load: function (imgName) {
        this.url = imgName;
        
		var img = new Image();
		img.src = imgName;

		this.img = img;

		gSpriteSheets[imgName] = this;
	},

	defSprite: function (name, x, y, w, h, cx, cy) {

		var spt = {
			"id": name,
			"x": x,
			"y": y,
			"w": w,
			"h": h,
			"cx": cx == null ? 0 : cx,
			"cy": cy == null ? 0 : cy
		};

		this.sprites.push(spt);
	},

	parseAtlasDefinition: function (atlasJSON) {

        
	}

});

