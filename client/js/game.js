var imageAssets = ["images/explosion.png", "images/tileset.png", "images/char_gold.png", "images/char_silver.png", "images/atlas.png"];
var scene, gameLoop, objects = {}, ticker, input, grid;
var gameWidth = 15,
    gameHeight = 10;
var remotePlayers,
    socket,
    localPlayer;


window.onload = function() {
    remotePlayers = [];
    scene = sjs.Scene({
        w: (gameWidth) * 32,
        h: (gameHeight) * 32
    });

    ticker = scene.Ticker(gameLoop, {
        tickDuration: 100
    });
    input = scene.Input();
    setEventHandlers();
    socket = io.connect("http://localhost", {port: 8000, transports: ["websocket"]});
    scene.loadImages(imageAssets, function() {

        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('foreground', {
            useCanvas: 'true'
        });

        grid = new Grid();
        //test code
        // npc = new Person(foreground, 0, 0);
        user = new Player(foreground, 3, 2);
        var w;

        w = new Wall(foreground, 1, 1);
        w = new Wall(foreground, 5, 5);
        w = new Wall(foreground, 6, 5);
        w = new Wall(foreground, 5, 4);
        w = new Wall(foreground, 8, 1);
        w = new Wall(foreground, 4, 2);
        w = new Wall(foreground, 4, 3);
        w = new Wall(foreground, 2, 2);
        w = new Wall(foreground, 4, 1);
        w = new Wall(foreground, 3, 1);
        w = new Wall(foreground, 3, 3);
        w = new Wall(foreground, 2, 3);
        w = new Wall(foreground, 1, 4);
        w = new Wall(foreground, 1, 5);
        var b = new Bomb(foreground, 1, 2, 2);

        ticker.run();

    });

};

function gameLoop() {

    for (var i in objects)
        if (i in objects)
            objects[i].update();

}

var setEventHandlers = function(){
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);    
}

function onSocketConnected() {
    console.log("Connected to socket server");
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: "+data.id);
};

function onMovePlayer(data) {

};

function onRemovePlayer(data) {

};

function Grid() {

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
        Array.prototype.filter = function(fun /*, thisp */ ) {
            "use strict";

            if (this === null) throw new TypeError();

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") throw new TypeError();

            var res = [];
            var thisp = arguments[1];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (fun.call(thisp, val, i, t)) res.push(val);
                }
            }

            return res;
        };
    }

    var self = [];

    // populate 2d grid array with empty arrays
    var row = [];
    for (var i = 0; i < gameWidth; i++) {
        row[i] = [];
    }
    for (var i = 0; i < gameHeight; i++) {
        self[i] = row.clone();
    }

    // Arguments can be entity or x, y. 
    // If entity, returns the other entites occupying the same position.
    self.at = function() {
        if (typeof arguments[0] === "object") {
            var entity = arguments[0];
            return grid[entity.yGrid][entity.xGrid].filter(function (element, index, array) {
                return element !== entity;
            });
        } else {
            console.log("called grid["+y+"]["+x+"]");
            var x = arguments[0];
            var y = arguments[1];
            if (x >= gameWidth || y >= gameHeight)
                return [];
            return grid[y][x];
        }
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
            object.xGrid = x;
            object.yGrid = y;
            self.add(object, x, y);
            return true;
        }
        else
            return false;
    };

    self.moveBy = function(object, xDelta, yDelta) {
        var newX = object.xGrid + xDelta;
        var newY = object.yGrid + yDelta;
        if (self.canMoveTo(object, newX, newY)) {
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

}



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

function Wall(layer, xGrid, yGrid) {

    var self = new Entity(xGrid, yGrid, "wall");
    self.sprite = scene.Sprite("images/tileset.png", {
        layer: layer,
        x: (xGrid * 32),
        y: (yGrid * 32),
        size: [32, 32],
        xoffset: 4 * 32,
        yoffset: (6 * 32) + 10
    });

    self.health = 1;

    self.damage = function() {
        self.health -= 1;
        if (self.health === 0) self.destroy();
    };

    self.update = function() {
        self.sprite.update();
    };
    self.destroy = function() {
        grid.remove(self);
        delete objects[self.hash];
        self.sprite.remove();
    };

    self.update();
    return self;
}

function Bomb(layer, xGrid, yGrid, radius) {

    var self = new Entity(xGrid, yGrid, "bomb");
    self.sprite = scene.Sprite("images/atlas.png", {
        layer: layer,
        x: (xGrid * 32) - 16,
        y: (yGrid * 32) - 16,
        size: [64, 64],
        xscale: 0.5,
        yscale: 0.5,
        xoffset: 2 * 66,
        yoffset: 0 * 64

    });
    self.radius = radius;

    var iX = 2,
        iY = 0,
        steps = 1;
    self.update = function() {
        self.sprite.update();
        self.sprite.setXOffset(iX++ * 66);
        self.sprite.setYOffset(iY * 66);
        if (steps === 5) {
            iY++;
            iX = 0;
        } else if (steps === 9) {
            self.explode();
        }
        steps++;
    };

    self.explode = function() {

        // How do you simplify this repetition?
        var r, newVal, f;

        f = new Fire(layer, self.xGrid, self.yGrid, 0);

        // up
        for (r = 1; r <= self.radius; r++) {
            // console.log("self.yGrid - r = " + (self.yGrid - r <= 1) )
            newVal = self.yGrid - r;
            if (newVal >= 0) {
                if (r === self.radius || newVal === 0 || grid.at(newVal,self.xGrid).contains("wall")) {
                    f = new Fire(layer, self.xGrid, newVal, -4);
                    break;
                } else {
                    f = new Fire(layer, self.xGrid, newVal, -3);
                }
            }
        }
        // down
        for (r = 1; r <= self.radius; r++) {
            newVal = self.yGrid + r;
            if (newVal < gameHeight) {
                if (r === self.radius || newVal === gameHeight - 1 || grid.at(newVal,self.xGrid).contains("wall")) {
                    f = new Fire(layer, self.xGrid, newVal, 4);
                    break;
                } else {
                    f = new Fire(layer, self.xGrid, newVal, 3);
                }
            }
        }
        // left
        for (r = 1; r <= self.radius; r++) {
            newVal = self.xGrid - r;
            if (newVal >= 0) {
                if (r === self.radius || newVal === 1 || grid.at(self.yGrid,newVal).contains("wall")) {
                    f = new Fire(layer, newVal, self.yGrid, -2);
                    break;
                } else {
                    f = new Fire(layer, newVal, self.yGrid, -1);
                }
            }
        }
        // right
        for (r = 1; r <= self.radius; r++) {
            newVal = self.xGrid + r;
            if (newVal < gameWidth) {
                if (r === self.radius || newVal === gameWidth - 1 || grid.at(self.yGrid,newVal).contains("wall")) {
                    f = new Fire(layer, newVal, self.yGrid, 2);
                    break;
                } else {
                    f = new Fire(layer, newVal, self.yGrid, 1);
                }
            }
        }

        self.destroy();

    };

    self.destroy = function() {
        grid.remove(self);
        delete objects[self.hash];
        self.sprite.remove();
    };

    self.update();

}
/**
 * Fire class
 * @param {[type]} layer
 * @param {[type]} xGrid
 * @param {[type]} yGrid
 * @param int type 0=+ 1=- 2=-> -1=- -2=<- 3=| 4=|^ -3=| -4=|.
 */
function Fire(layer, xGrid, yGrid, type) {
    var self = new Entity(xGrid, yGrid, "fire");
    var scale = 1,
        angle = 0;
    if (type < 0) {
        type *= -1;
        scale = -1;
    }
    if (type === 4) {
        type = 2;
        angle = 1.570;
    }
    if (type === 3) {
        type = 1;
        angle = 1.570;
    }
    self.sprite = scene.Sprite("images/explosion.png", {
        "layer": layer,
        "x": (xGrid * 32),
        "y": (yGrid * 32),
        "size": [32, 32],
        "xoffset": type * 32,
        "yoffset": 0,
        "angle": angle,
        "xscale": scale,
        "yscale": scale
    });

    self.lifetime = 2;
    self.createdOn = ticker.currentTick;
    var i = 0;
    self.update = function() {
        i = i === 1 ? 1 : 0;
        self.sprite.setYOffset(i++ * 32);
        if (ticker.currentTick - self.createdOn >= self.lifetime) self.destroy();
        else self.sprite.update();
    };
    self.destroy = function() {
        // console.log('grid['+self.yGrid+']['+self.xGrid+']');
        // kill or damage people and walls
        var intersects = grid.at(self);

        for (var i = 0; i < intersects.length; i++) {
            var o =  intersects[i];
            switch (o.type) {
            case "person":
                console.log("About to die person " + o.hash);
                unhash(o.hash).die();
                break;
            case "wall":
                unhash(o.hash).damage();
                break;
            default:
                break;
            }
        }


        grid.remove(self);
        self.sprite.remove();
        delete objects[self.hash];
    };
    self.update();
}

function hashify() {
    // needs to be improved, sometimes tiles disappear due to collisions
    return Math.ceil(Date.now() + Math.random() * 1000);
}

function unhash(hash) {
    return objects[hash];
}
