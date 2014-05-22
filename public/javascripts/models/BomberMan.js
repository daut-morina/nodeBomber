define(['models/Item'], function(Item) {
    var imageObj;

    function BomberMan(x, y, size, color) {
        Item.call(this, x, y, size, color);
        imageObj = new Image();
        imageObj.src = 'images/cbcharactvx1009.png';
        this.tick = 0;

        this.direction = 0;
        this.northX = 0;
        this.westX = 0;
        this.eastX = 0;
        this.southX = 0;



    }

    BomberMan.prototype = new Item();

    /*BomberMan.prototype.draw = function(context) {
        context.drawImage(imageObj, this.x, this.y);
    };*/

    BomberMan.prototype.draw = function(context) {
        switch (this.direction) {
            case 'u':
                this.drawNorth(context);
                return;
            case 'r':
                this.drawEast(context);
                return;
            case 'd':
                this.drawSouth(context);
                return;
            case 'l':
                this.drawWest(context);
                return;
            default:
                break;
        }

        context.drawImage(
            imageObj,
            0,
            0,
            32,
            48,
            this.x,
            this.y,
            32,
            48);
    };
    BomberMan.prototype.drawNorth = function(context) {
        this.tick++;

        if (this.tick % 10 === 0) {
            this.tick = 0;
            this.northX = this.northX % 96 + 32;
            if (this.northX === 0) {
                this.northX = 32;
            }
        }

        context.drawImage(
            imageObj,
            this.northX,
            144,
            32,
            48,
            this.x,
            this.y,
            32,
            48);
    };
    BomberMan.prototype.drawEast = function(context) {
        this.tick++;

        if (this.tick % 10 === 0) {
            this.tick = 0;
            this.eastX = this.eastX % 96 + 32;
            if (this.eastX === 0) {
                this.eastX = 32;
            }
        }

        context.drawImage(
            imageObj,
            this.eastX,
            96,
            32,
            48,
            this.x,
            this.y,
            32,
            48);
    };
    BomberMan.prototype.drawSouth = function(context) {
        this.tick++;

        if (this.tick % 10 === 0) {
            this.tick = 0;
            this.southX = this.southX % 96 + 32;
            if (this.southX === 0) {
                this.southX = 32;
            }
        }

        context.drawImage(
            imageObj,
            this.southX,
            0,
            32,
            48,
            this.x,
            this.y,
            32,
            48);
    };
    BomberMan.prototype.drawWest = function(context) {
        this.tick++;

        if (this.tick % 10 === 0) {
            this.tick = 0;
            this.westX = this.westX % 96 + 32;
            if (this.westX === 0) {
                this.westX = 32;
            }
        }

        context.drawImage(
            imageObj,
            this.westX,
            48,
            32,
            48,
            this.x,
            this.y,
            32,
            48);
    };

    return BomberMan;
});
