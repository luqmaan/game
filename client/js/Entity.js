function Entity(xGrid, yGrid, type) {
    console.log("new " + type + " at (" + xGrid + "," + yGrid + ")");
    var self = this;
    self.xGrid = xGrid;
    self.yGrid = yGrid;
    self.hash = hashify();
    self.type = type;
    grid.add(self);
    objects[self.hash] = self;
    return self
}