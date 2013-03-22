//serve the grid/foreground

/*function Grid() {

    Array.prototype.clone = function() {
        var arr = this.slice(0);
        for( var i = 0; i < this.length; i++ ) {
            if( this[i].clone ) {
                //recursion
                arr[i] = this[i].clone();
            }
        }
        return arr;
    };

    // add contains function
    Array.prototype.contains = function(type) {
        var t = Object(this);
        for (var i = 0; i < t.length; t++) {
            if (i in t) {
                if (t[i].type === type)
                    return true;
            }
        }
        return false;
    };

    // add filter function
    if (!Array.prototype.filter) {
        Array.prototype.filter = function(fun , thisp  ) {
            "use strict";

            if (this === null) throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
    };

    self.add = function(object) {
        if (self.canMoveTo(object, object.xGrid, object.yGrid)) {
            grid[object.yGrid][object.xGrid].push({
                type: object.type,
                hash: object.hash
            });
        }
        else {
            console.error("Cannot add " + object.type + " to ("+object.xGrid+","+object.yGrid+")");
        }
    };

    self.remove = function(object) {
        grid[object.yGrid][object.xGrid] = grid[object.yGrid][object.xGrid].filter(function (element, index, array) {
            return element.hash !== object.hash;
        });
    };

    self.moveTo = function(object, x, y) {
        if (self.canMoveTo(object, x, y)) {
            self.remove(object);
            object.xGrid = newX;
            object.yGrid = newY;
            grid[object.yGrid][object.xGrid].push({
                type: object.type,
                hash: object.hash
            });
            return true;
        }
        else
            return false;
    };

    self.canMoveTo = function(object, x, y) {
        if (x < 0 || y < 0 || x >= gameWidth || y >= gameHeight) {
            return false;
        }
        else if (grid[y][x].contains("bomb") || grid[y][x].contains("wall")) {
            return false;
        }
        return true;
    };

    self.dump = function() {

        for (var i = 0; i < self.length; i++) {
            var r = i + " | ";
            for (var j = 0; j < self[i].length; j++) {
                if (self[i][j].length > 0) {
                    for (var k = 0; k < self[i][j].length; k++) {
                        r += " "+j+"="+self[i][j][k].type;
                    }
                }
                else {
                    r += " "+j+"=_";
                }
            }
            console.log(r);
        }

    };

    return self;

}*/


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

function Player(layer, xGrid, yGrid) {
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
    return self;
}


/*function hashify() {
    // needs to be improved, sometimes tiles disappear due to collisions
    return Math.ceil(Date.now() + Math.random() * 1000);
}*/

/*function unhash(hash) {
    return objects[hash];
}*/


exports.Player = Player;
