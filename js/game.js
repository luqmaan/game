var imageAssets = ["images/BombermanDojo.png"];
var scene, gameLoop, persons = [], input;

window.onload = function() {
    scene = sjs.Scene({
        w: 700,
        h: 400
    });

    var ticker = scene.Ticker(gameLoop);
    input = scene.Input();

    scene.loadImages(imageAssets, function() {
        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('background', {
            useCanvas: 'true'
        });

        a = new Person(background, 100, 200);
        b = new Player(background, 150, 230);

        ticker.run();

    });
};

function gameLoop() {

    for (var i = 0; i < persons.length; i++)
        persons[i].update();

}

function Person(layer, x, y) {
    var self = this;
    var options = {
        layer: layer,
        xoffset: 230,
        x: x,
        y: y,
        size: [20, 36]
    };
    self.sprite = scene.Sprite("images/BombermanDojo.png", options);
    self.update = function() {
        self.sprite.update();
    };
    self.move = function(direction) {
        var x = 0, y = 0;
        switch (direction) {
        case "left":
            x = -1;
            break;
        case "right":
            x = 1;
            break;
        case "down":
            y = 1;
            break;
        case "up":
            y = -1;
            break;
        default:
            x = 0, y = 0;
        break;
        }
        self.sprite.move(x, y);
        self.sprite.update();
    };
    self.update();
    persons.push(self);
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
