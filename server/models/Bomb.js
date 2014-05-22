var Item = require("./Item").Item;

var Bomb = (function() {
    function Bomb(id, x, y, size, color) {
        Item.call(this, id, x, y, size, color);
    }

    Bomb.prototype = new Item();

    return Bomb;
})();

exports.Bomb = Bomb;

