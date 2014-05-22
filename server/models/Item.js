var Item = (function() {
    function Item(id, x, y, size, color) {
        this.id = id || 0;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }

    return Item;
})();

exports.Item = Item;