/**
 * Created by fabiolaib on 10.04.14.
 */
function Bomb(initX, initY) {
    console.log("bomb created");
    Item.call(initX,initY, 10, "#ff0000");
    this.detonate = false;
    this.timer = setTimeout(this.boom, 3000);
}

Bomb.prototype = {
    boom: function() {
        this.detonate = true;
        console.log("boooooom");
    },
    getDetonate: function() {
        return this.detonate;
    }
}
//Bomb.prototype.timer = setTimeout(this.boom, 3000);
inherits(Bomb, Item);


