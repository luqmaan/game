//should modularize these, but i'm lazy
function Entity(xGrid, yGrid, type) {
    console.log("new " + type + " at (" + xGrid + "," + yGrid + ")");
    var self = this;
    self.xGrid = xGrid;
    self.yGrid = yGrid;
    self.hash = hashify();
    self.type = type;
    grid.add(self);
    objects[self.hash] = self;
}

function Person(layer, xGrid, yGrid) {
    var self = new Entity(xGrid, yGrid, "person");
    var id;
    var options = {
        layer: layer,
        x: xGrid * 32,
        y: yGrid * 32,
        size: [32, 32],
        xscale: 1,
        yscale: 1,
        xoffset: 4,
        yoffset: 5,
        rv: Math.PI / 8
    };
    self.sprite = scene.Sprite("images/char_gold.png", options);
    self.update = function() {
        self.sprite.update();
    };
    self.die = function() {
        if (grid.moveTo(self, 0, 0)) {
            console.log("yes can move there")
            self.sprite.setX(0);
            self.sprite.setY(0);
        } else {
            console.error("uhoh can't move there");
        }
        self.sprite.setOpacity(0.5);
    };
    self.move = function(direction) {
        var x = 0,
            y = 0;
        self.sprite.setOpacity(1);
        switch (direction) {
        case "up":
            y = -1;
            self.sprite.setYOffset(4);
            break;
        case "down":
            y = 1;
            self.sprite.setYOffset(84 + 4);
            break;
        case "left":
            x = -1;
            self.sprite.setYOffset(124 + 7);
            break;
        case "right":
            x = 1;
            self.sprite.setYOffset(32 + 14);
            break;
        default:
            break;
        }
        if (grid.moveBy(self, x, y)) {
            x *= 32;
            y *= 32;
            self.sprite.move(x, y);
        }
        self.sprite.update();
    };
    self.getX = function(){
    	return x;
    };
    self.getY = function(){
    	return y;
    };

    self.update();
    return self;
}

var Player = (layer, xGrid, yGrid) {
    var self = new Person(layer, xGrid, yGrid);
    self.update = function() {
        if (input.keyboard.space) {
            var b = new Bomb(layer, self.xGrid, self.yGrid, 2);
        }
        if (input.keyboard.up) {
            self.move("up");
        } else if (input.keyboard.down) {
            self.move("down");
        } else if (input.keyboard.left) {
            self.move("left");
        } else if (input.keyboard.right) {
            self.move("right");
        } else {
            self.sprite.update();
        }
    };
    return {
    	var id:self.id,
    	var getX: self.getX(),
    	var getY: self.getY()
    }; 
}

exports.Player = Player;