var Item = require("./Item").Item;

var BomberMan = (function() {
    function BomberMan(id, x, y, size, color) {
        Item.call(this, id, x, y, size, color);
    }

    BomberMan.prototype = new Item();

    return BomberMan;
})();

exports.BomberMan = BomberMan;