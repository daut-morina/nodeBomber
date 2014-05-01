function Player(initX, initY, initColor) {
Item.call(this, initX, initY, 10, initColor);
}
Player.prototype = {
    //todo: 10 durch Breite, Höhe des Players ersetzen
    getAggregatedX: function() {
        return (4 * this.x) + (2 * 10);
    },

    //todo: 10 durch Breite, Höhe des Players ersetzen
    getAggregatedY: function() {
        return (4 * this.y) + (2 * 10);
    }
};

inherits(Player, Item);