define(function() {
    function Item(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.id = null;
    }

    Item.prototype.draw = function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.size, this.size);
    };

    Item.prototype.erase = function(context) {
        context.clearRect(this.x, this.y, this.size, this.size);
    };

    return Item;
});
