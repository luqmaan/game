var imageAssets = ["images/BombermanDojo.png", "images/tileset.png", "images/char_gold.png", "images/char_silver.png"];
var scene, gameLoop, objects = [], input;

window.onload = function() {
    scene = sjs.Scene({
        w: 700,
        h: 400
    });

    var ticker = scene.Ticker(gameLoop, {
        tickDuration: 32
    });
    input = scene.Input(); 

    scene.loadImages(imageAssets, function() {
        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('background', {
            useCanvas: 'true'
        });

        a = new Person(foreground, 100, 200);
        b = new Player(foreground, 150, 230);
        w = new Wall(background, 50, 230);

        ticker.run();

    });
};

function gameLoop() {

    for (var i = 0; i < objects.length; i++)
        objects[i].update();

}

function canMoveTo(object, newX, newY) {

    return true;

}

function Person(layer, x, y) {
    var self = this;
    var options = {
        layer: layer,
        x: x,
        y: y,
        size: [32, 42],
        xscale: 1,
        yscale: 1,
        xoffset: 4,
        yoffset: 0,
        color: 'green'
    };
    self.sprite = scene.Sprite("images/char_gold.png", options);
    self.update = function() {
        self.sprite.update();
    };
    self.move = function(direction) {
        var x = 0, y = 0;
        switch (direction) {
        case "left":
            x = -1;
            self.sprite.setYOffset(124);
            break;
        case "right":
            x = 1;
            self.sprite.setYOffset(32+8);
            break;
        case "down":
            y = 1;
            self.sprite.setYOffset(84);
            break;
        case "up":
            y = -1;
            self.sprite.setYOffset(0);
            break;
        default:
            x = 0, y = 0;
        break;
        }

        x*=10, y*=10;

        if (canMoveTo(self, x, y)) {
            self.sprite.move(x, y);
        }
        self.sprite.update();            

    };
    self.update();
    objects.push(self);
    return self;
}

function Player(layer, x, y) {
    var self = new Person(layer, x, y);
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

function Wall(layer, x, y) {
    var self = this;
    self.sprite = scene.Sprite("images/tileset.png",{
        layer: layer, 
        x: x,
        y: y,
        size: [32, 32],
        color: 'red',
        xoffset: 4*32,
        yoffset: (6*32)+10
    });
    self.update = function() {
        self.sprite.update();
    };
    self.sprite.setBackgroundRepeat("repeat");
    objects.push(self);
    self.update();
    return self;
}
