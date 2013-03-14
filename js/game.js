var imageAssets = ["images/explosion.png", "images/tileset.png", "images/char_gold.png", "images/char_silver.png", "images/atlas.png"];
var scene, gameLoop, objects = {}, ticker, input, walls = [];
var gameWidth = 15,
    gameHeight = 15;


window.onload = function() {
    scene = sjs.Scene({
        w: (gameWidth) * 32,
        h: (gameHeight) * 32
    });

    ticker = scene.Ticker(gameLoop, {
        tickDuration: 200
    });
    input = scene.Input();

    scene.loadImages(imageAssets, function() {

        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('foreground', {
            useCanvas: 'true'
        });

        npc = new Person(foreground, 0, 0);
        user = new Player(foreground, 1, 1);
        w1 = new Wall(foreground, 5, 5);
        w2 = new Wall(foreground, 6, 5);
        w3 = new Wall(foreground, 5, 4);
        b = new Bomb(foreground, 1, 0, 2);
        f = new Fire(foreground, 3, 3, 1);

        ticker.run();

    });

    // populate 2d walls array with zeros
    var row = [];
    for (var i = 0; i < gameWidth; i++)
    row[i] = 0;
    for (i = 0; i < gameHeight; i++)
    walls[i] = row.slice(0);

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
        console.log("walls[" + newY + "][" + newX + "] = " + walls[newY][newX]);
        if (walls[newY][newX] === 0) return true;
    }
    return false;
}


function performOnNearbySpots(object, action) {
    var x = object.xGrid;
    var y = object.yGrid;

    var spots = [];
    if (y+1<gameHeight)
        spots.push([x,y+1]);
    if (y-1>-1)
        spots.push([x,y-1]);
    if (x+1<gameWidth)
        spots.push([x+1,y]);
    if (x-1>-1)
        spots.push([x-1,y]);

    return spots;
}

function Entity(xGrid, yGrid) {
    var self = this;
    self.xGrid = xGrid;
    self.yGrid = yGrid;
    self.hash = hash();
}

function Person(layer, xGrid, yGrid) {
    var self = new Entity(xGrid, yGrid);
    var options = {
        layer: layer,
        x: xGrid * 32,
        y: yGrid * 32,
        size: [32, 32],
        xscale: 1,
        yscale: 1,
        xoffset: 4,
        yoffset: 5,
        color: 'green'
    };
    self.sprite = scene.Sprite("images/char_gold.png", options);
    self.update = function() {
        self.sprite.update();
    };
    self.move = function(direction) {
        var x = 0,
            y = 0;
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
            self.xGrid += x;
            self.yGrid += y;
            console.log("self.xGrid " + self.xGrid + " self.yGrid " + self.yGrid);
            x *= 32, y *= 32;
            self.sprite.move(x, y);
        }
        self.sprite.update();

    };
    self.update();
    objects[self.hash] = self;
    return self;
}

function Player(layer, xGrid, yGrid) {
    var self = new Person(layer, xGrid, yGrid);
    self.update = function() {
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

    walls[yGrid][xGrid] = self;

    self.update = function() {
        self.sprite.update();
    };
    self.destroy = function() {
        walls[self.yGrid][self.xGrid] = 0;
    };

    self.sprite.setBackgroundRepeat("repeat");
    self.hash = hash(self);
    objects[self.hash] = self;
    self.update();
    return self;
}

function Bomb(layer, xGrid, yGrid, strength) {

    var self = this;
    self.sprite = scene.Sprite("images/atlas.png", {
        layer: layer,
        x: (xGrid * 32) - 16,
        y: (yGrid * 32) - 16,
        size: [64, 64],
        color: 'red', 
        xscale: 0.5,
        yscale: 0.5,
        xoffset: 2 * 66,
        yoffset: 0 * 64

    });
    self.xGrid = xGrid;
    self.yGrid = yGrid;

    var iX = 2, iY = 0, steps = 1;
    self.update = function() {
        self.sprite.update();
        self.sprite.setXOffset(iX++ * 66);
        self.sprite.setYOffset(iY * 66);
        if (steps == 5) {
            iY++;
            iX = 0;        
        }
        else if (steps == 9) {
            self.explode();
        }
        steps++;
    };
    self.spotsToExplode = function() {
        var spots = [-1,-1,-1,-1];
        for (var r = 0; r < self.radius; r++) {
            var x = object.xGrid;
            var y = object.yGrid;

            if (y+1<gameHeight)
                spots.push([x,y+1]);
            if (y-1>-1)
                spots.push([x,y-1]);
            if (x+1<gameWidth)
                spots.push([x+1,y]);
            if (x-1>-1)
                spots.push([x-1,y]);
        }
        return spots;
    };

    self.explode = function() {

        new Fire(layer, self.xGrid, self.yGrid, 0);

        // for (var i in nearbySpots(self)) {

        // }

        self.destroy();
    };
    self.destroy = function() {
        walls[self.yGrid][self.yGrid] = 0;
        delete objects[self.hash];
        self.sprite.remove();
    };

    self.hash = hash(self);
    objects[self.hash] = self;

    self.update();
}

function Fire(layer, xGrid, yGrid, type) {
    var self = this;
    self.sprite = scene.Sprite("images/explosion.png", {
        layer: layer,
        x: (xGrid * 32),
        y: (yGrid * 32),
        size: [32, 32],
        xoffset: type * 32,
        yoffset: 0 
    });
    self.lifetime = 2;
    self.createdOn = ticker.currentTick;
    var i = 0;
    self.update = function() {
        i = i == 1 ? 1 : 0;
        self.sprite.setYOffset(i++ * 32);
        if (ticker.currentTick - self.createdOn >= self.lifetime)
            self.destroy();
        else
            self.sprite.update();
    };
    self.destroy = function() {
        delete objects[self.hash];
        self.sprite.remove();
    };
    objects[self.hash] = self;
    self.update();
}

function hash() {
    return Math.ceil(Date.now() + Math.random() * 100);
}