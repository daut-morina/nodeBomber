define(['models/Item'], function(Item) {
    function Obstacle(id, x, y, size, socket, destroyable) {
        Item.call(this, id, x, y, size, socket);

        this.destroyable = destroyable || false;
    }

    Obstacle.prototype = new Item();

    return Obstacle;
});