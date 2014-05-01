function Obstacle(initX, initY, initDestroyable) {
    Item.call(this, initX, initY, 20, "#ff6600");
    this.destroyable = initDestroyable || false;
}

inherits(Obstacle, Item);
