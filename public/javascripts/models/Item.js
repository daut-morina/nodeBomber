define(function() {
    function Item(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.id = null;
    }
    var imageObj = new Image();
    imageObj.src = 'images/Unbenannt.gif';

    Item.prototype.draw = function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    };
    Item.prototype.drawNorth = function(context) {};
    Item.prototype.drawEast = function(context) {};
    Item.prototype.drawSouth = function(context) {};
    Item.prototype.drawWest = function(context) {};


    Item.prototype.erase = function(context) {
        context.clearRect(this.x, this.y, this.size, this.size);
    };

    return Item;
});
