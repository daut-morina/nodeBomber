var Item = require("./Item").Item;

var Obstacle = (function() {
    function Obstacle(id, x, y, size, color, destroyable) {
        Item.call(this, id, x, y, size, color);
        this.destroyable = destroyable || false;
    }

    Obstacle.prototype = new Item();

    return Obstacle;
})();

exports.Obstacle = Obstacle;