
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