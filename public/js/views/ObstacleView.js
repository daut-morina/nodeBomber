define(['views/ItemView'], function(ItemView) {
    function Obstacle(id, x, y, size, color, destroyable) {
        ItemView.call(this, id, x, y, size, color);
        this.destroyable = destroyable || false;
    }

    Obstacle.prototype = new ItemView();

    return Obstacle;
});