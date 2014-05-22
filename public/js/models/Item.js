define(function() {
    function Item(id, x, y, size, socket) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.size = size;
        this.socket = socket;
    }

    return Item;
});
