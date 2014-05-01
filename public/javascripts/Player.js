function Player(initX, initY, initColor) {
Item.call(this, initX, initY, 20, initColor);
    console.log(this);
}

inherits(Player, Item);
