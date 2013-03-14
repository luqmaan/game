var imageAssets = ["images/BombermanDojo.png", "images/tileset.png", "images/char_gold.png", "images/char_silver.png"];
var scene, gameLoop, objects = [], input, walls = [];
var gameWidth = 15, gameHeight = 8;


window.onload = function() {
    scene = sjs.Scene({
        w: (gameWidth) * 32,
        h: (gameHeight) * 32
    });

    var ticker = scene.Ticker(gameLoop, {
        tickDuration: 128
    });
    input = scene.Input(); 

    scene.loadImages(imageAssets, function() {

        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('background', {
            useCanvas: 'true'
        });

        a = new Person(foreground, 0, 0);
        b = new Player(foreground, 1, 1);
        w = new Wall(background, 5, 5);
        w = new Wall(background, 6, 5);
        w = new Wall(background, 5, 4);

        ticker.run();

    });

    // populate 2d walls array with zeros
    var row = [];
    for (var i = 0; i < gameWidth; i++)
        row[i] = 0;
    console.log(row.length)
    for (i = 0; i < gameHeight; i++)
        walls[i] = row.slice(0);

};

function gameLoop() {

    for (var i = 0; i < objects.length; i++)
        objects[i].update();

}

function canMoveTo(object, xDelta, yDelta) {

    var newX = object.xGrid + xDelta;
    var newY = object.yGrid + yDelta;

    if (newX >= 0 && newY >= 0) {
        console.log("walls[" + newY + "][" + newX + "] = " + walls[newY][newX]);
        if (walls[newY][newX] === 0)
            return true;        
    }
    return false;
}

function Person(layer, xGrid, yGrid) {
    var self = this;
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
    self.xGrid = xGrid;
    self.yGrid = yGrid;
    self.update = function() {
        self.sprite.update();
    };
    self.move = function(direction) {
        var x = 0, y = 0;
        switch (direction) {
        case "left":
            x = -1;
            self.sprite.setYOffset(124+7);
            break;
        case "right":
            x = 1;
            self.sprite.setYOffset(32+14);
            break;
        case "down":
            y = 1;
            self.sprite.setYOffset(84+4);
            break;
        case "up":
            y = -1;
            self.sprite.setYOffset(4);
            break;
        default:
            break;
        }

        if (canMoveTo(self, x, y)) {
            self.xGrid += x;
            self.yGrid += y;
            console.log("self.xGrid " + self.xGrid + " self.yGrid " + self.yGrid );
            x*=32, y*=32;
            self.sprite.move(x, y);
        }
        self.sprite.update();            

    };
    self.update();
    objects.push(self);
    return self;
}

function Player(layer, xGrid, yGrid) {
    var self = new Person(layer, xGrid, yGrid);
    self.update = function() {
        if (input.keyboard.down) {
            self.move("down");
        }
        else if (input.keyboard.up) {
            self.move("up");
        }
        else if (input.keyboard.left) {
            self.move("left");
        }
        else if (input.keyboard.right) {
            self.move("right");
        }
        else {
            self.sprite.update();
        }
    };
    return self;
}

function Wall(layer, xGrid, yGrid) {

    var self = this;
    self.sprite = scene.Sprite("images/tileset.png",{
        layer: layer, 
        x: (xGrid * 32),
        y: (yGrid * 32),
        size: [32, 32],
        color: 'red',
        xoffset: 4*32,
        yoffset: (6*32)+10
    });

    walls[yGrid][xGrid] = self;

    self.xGrid = xGrid;
    self.yGrid = yGrid;


    self.update = function() {
        self.sprite.update();
    };
    self.destroy = function() {
        walls[self.yGrid][self.yGrid] = 0;
    };

    self.sprite.setBackgroundRepeat("repeat");
    objects.push(self);
    walls.push(self);
    self.update();
    return self;
}
