define(['models/Item'], function(Item) {
    function BomberMan(id, x, y, size, socket) {
        Item.call(this, id, x, y, size, socket);
    }

    BomberMan.prototype = new Item();

    return BomberMan;
});
