var Foo = function(){}
Foo.prototype.bar = 10;
x = new Foo();
y = new Foo();
x.bar = 12;
window.document.write(y.bar, x.bar);
