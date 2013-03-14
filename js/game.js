var imageAssets = ["images/BombermanDojo.png"];
var scene;

window.onload = function() {
    scene = sjs.Scene({
        w: 700,
        h: 400
    });
    scene.loadImages(imageAssets, function() {
        var background = scene.Layer('background', {
            useCanvas: 'true'
        });

        var foreground = scene.Layer('background', {
            useCanvas: 'true'
        });

        a = new Person(scene, background, 100, 200);
        b = new Player(scene, background, 150, 230);
    });
};

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
    self.sprite.update();
    return self;
}

function Player(layer, x, y) {
    var self = new Person(layer, x, y);
    return self;
}
