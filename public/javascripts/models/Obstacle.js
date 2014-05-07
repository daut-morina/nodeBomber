define(['models/Item'], function(Item) {
    function Obstacle(x, y, size, color, destroyable) {
        Item.call(this, x, y, size, color);
        this.destroyable = destroyable || false;
    }

    Obstacle.prototype = new Item();

    return Obstacle;
});