define(['models/Item'], function(Item) {
    function BomberMan(x, y, size, color) {
        Item.call(this, x, y, size, color);
    }

    BomberMan.prototype = new Item();

    return BomberMan;
});
