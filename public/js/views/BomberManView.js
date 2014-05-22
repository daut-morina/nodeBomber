define(['views/ItemView'], function(ItemView) {
    function BomberMan(id, x, y, size, color) {
        ItemView.call(this, id, x, y, size, color);
    }

    BomberMan.prototype = new ItemView();

    return BomberMan;
});
