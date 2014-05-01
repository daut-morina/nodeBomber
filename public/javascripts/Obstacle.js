//var Item = new require("./Item.js");
function Obstacle(initX, initY) {
    Item.call(this,initX, initY, 20, "#ff6600")
}


inherits(Obstacle, Item);



//module.exports = Obstacle;

