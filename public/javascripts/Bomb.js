/**
 * Created by fabiolaib on 10.04.14.
 */

/*var Bomb = function(initX, initY, bombContext) {
    var id;
    var x = initX;
    var y = initY;

    var detonating = false;
    var detonated = false;

    var context = bombContext;

    var setId = function(newId) {
        id = newId;
    };

    var getId = function() {
        return id;
    };

    var setX = function(newX) {
        x = newX;
    };

    var getX = function() {
        return x;
    };

    var setY = function(newY) {
        y = newY;
    };

    var getY = function() {
        return y;
    };

    var isDetonated = function() {
        return detonated;
    };

    var draw = function() {
        if (!detonating) {
            drawBomb();
        } else {
            drawExplosion();
        }
    };

    var drawBomb = function() {
        context.fillRect(x, y, 10, 10);
    };

    var drawExplosion = function() {
        context.fillRect(x, y, 10, 60);
        context.fillRect(x, y, 10, -50);
        context.fillRect(x, y, 60, 10);
        context.fillRect(x, y, -50, 10);
    };

    setTimeout(function() {
        detonating = true;
        setTimeout(function() {
            detonated = true;
        }, 1000);
    }, 3000);

    return {
        setId:          setId,
        getId:          getId,
        setX:           setX,
        getX:           getX,
        setY:           setY,
        getY:           getY,
        isDetonated:    isDetonated,
        draw:           draw
    };
};*/


function Bomb(initX, initY) {
    console.log("bomb created");
    Item.call(this, initX,initY, 10, "#ff0000");
    this.detonating = false;
    this.detonated = false;

    var self = this;
    this.that = this;
    setTimeout(function() {
        self.detonating = true;
            setTimeout(function() {
                self.detonated = true;
            }, 1000)
        }, 3000);
}

Bomb.prototype = {
    drawBomb: function(context) {
        if (!this.detonating) {
            this.draw(context);
        } else {
            this.drawExplosion(context);
        }
    },
    drawExplosion: function(context) {
        context.fillRect(this.x, this.x, 10, 60);
        context.fillRect(this.x, this.y, 10, -50);
        context.fillRect(this.x, this.y, 60, 10);
        context.fillRect(this.x, this.y, -50, 10);
    }
}
inherits(Bomb, Item);

