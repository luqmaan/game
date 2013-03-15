var imageAssets = ["images/explosion.png", "images/tileset.png", "images/char_gold.png", "images/char_silver.png", "images/atlas.png"];
var scene, gameLoop, objects = {}, ticker, input, obstacles = [];
var gameWidth = 15,
    gameHeight = 10;


window.onload = function() {
    scene = sjs.Scene({
        w: (gameWidth) * 32,
        h: (gameHeight) * 32
    });

    ticker = scene.Ticker(gameLoop, {
        tickDuration: 100
    });
    input = scene.Input();

    scene.loadImages(imageAssets, function() {

        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('foreground', {
            useCanvas: 'true'
        });

        // npc = new Person(foreground, 0, 0);
        var user = new Player(foreground, 3, 2);
        var w;
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
        var b = new Bomb(foreground, 2, 1, 5);

        ticker.run();

    });

    // populate 2d obstacles array with zeros
    var row = [];
    for (var i = 0; i < gameWidth; i++)
        row[i] = 0;
    for (i = 0; i < gameHeight; i++)
        obstacles[i] = row.slice(0);

};

function gameLoop() {

    for (var i in objects) {
        objects[i].update();
    }

}

function canMoveTo(object, xDelta, yDelta) {

    var newX = object.xGrid + xDelta;
    var newY = object.yGrid + yDelta;

    if (newX >= 0 && newY >= 0 && newX < gameWidth && newY < gameHeight) {
        console.log("obstacles[" + newY + "][" + newX + "] = " + obstacles[newY][newX]);
        if (obstacles[newY][newX] === 0 || obstacles[newY][newX].type === "person")
            return true;
    }
    return false;
}

function Entity(xGrid, yGrid, type) {
    var self = this;
    self.xGrid = xGrid;
    self.yGrid = yGrid;
    self.hash = hashify();
    self.updateObstaclePosition = function() {
        obstacles[self.yGrid][self.xGrid] = {type: type, hash: self.hash};
    };
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
        rv: Math.PI/8
    };
    self.sprite = scene.Sprite("images/char_gold.png", options);
    self.update = function() {
        self.sprite.update();
    };
    self.die = function() {
        self.sprite.setX(0);
        self.sprite.setY(0);
        self.xGrid = 0;
        self.yGrid = 0;
        self.updateObstaclePosition();
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

        if (canMoveTo(self, x, y)) {
            obstacles[self.yGrid][self.xGrid] = 0;
            self.xGrid += x;
            self.yGrid += y;
            self.updateObstaclePosition();
            console.log("self.xGrid " + self.xGrid + " self.yGrid " + self.yGrid);
            x *= 32;
            y *= 32;   
            self.sprite.move(x, y);
        }
        self.sprite.update();
    };
    self.update();
    objects[self.hash] = self;
    self.updateObstaclePosition();
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

    var self = new Entity(xGrid, yGrid);
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
        if (self.health === 0)
            self.destroy();
    };

    obstacles[yGrid][xGrid] = {type: "wall", hash: self.hash};

    self.update = function() {
        self.sprite.update();
    };
    self.destroy = function() {
        obstacles[self.yGrid][self.xGrid] = 0;
        delete objects[self.hash];
        self.sprite.remove();
    };

    self.sprite.setBackgroundRepeat("repeat");
    objects[self.hash] = self;
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

    var iX = 2, iY = 0, steps = 1;
    self.update = function() {
        self.sprite.update();
        self.sprite.setXOffset(iX++ * 66);
        self.sprite.setYOffset(iY * 66);
        if (steps === 5) {
            iY++;
            iX = 0;
        }
        else if (steps === 9) {
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
                if (r === self.radius || newVal === 0 || obstacles[newVal][self.xGrid] === 1) {
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
                if (r === self.radius || newVal === gameHeight-1 || obstacles[newVal][self.xGrid] === 1) {
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
                if (r === self.radius || newVal === 1 || obstacles[self.yGrid][newVal] === 1) {
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
                if (r === self.radius || newVal === gameWidth-1 || obstacles[self.yGrid][newVal] === 1) {
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
        obstacles[self.yGrid][self.xGrid] = 0;
        delete objects[self.hash];
        self.sprite.remove();
    };

    objects[self.hash] = self;
    self.updateObstaclePosition();

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
    var scale = 1, angle = 0;
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
    console.log(angle);

    self.lifetime = 2;
    self.createdOn = ticker.currentTick;
    var i = 0;
    self.update = function() {
        i = i === 1 ? 1 : 0;
        self.sprite.setYOffset(i++ * 32);
        if (ticker.currentTick - self.createdOn >= self.lifetime)
            self.destroy();
        else
            self.sprite.update();
    };
    self.destroy = function() {
        // console.log('obstacles['+self.yGrid+']['+self.xGrid+']');
        // kill or damage people and walls
        var o = obstacles[self.yGrid][self.xGrid];
        switch (o.type) {
        case "person":
            console.log("About to die person " + o.hash);
            getHash(o.hash).die();
            break;
        case "wall":
            getHash(o.hash).damage();
            break;
        default:
            break;
        }

        delete objects[self.hash];
        self.sprite.remove();
    };
    objects[self.hash] = self;
    self.update();
}

function hashify() {
    // needs to be improved, sometimes tiles disappear due to collisions
    return Math.ceil(Date.now() + Math.random() * 1000);
}

function getHash(hash) {
    return objects[hash];
}