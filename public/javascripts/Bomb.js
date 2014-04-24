/**
 * Created by fabiolaib on 10.04.14.
 */
var Bomb = function(initX, initY, initTimer) {
    var id;
    var timer = initTimer;
    var x = initX;
    var y = initY;
    var testFunction = null;

    var boom = function() {
        console.log("boom!");
    }

    var timer = setTimeout(boom, 3000);

    var setTimer = function(time) {
        timer = time;
   }

    var setId = function(newId) {
        id = newId;
    }

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

    var draw = function(context) {
        context.fillRect(x, y, 10, 10);

    };

    return {
        setTimer: setTimer,
        setId:  setId,
        getId:  getId,
        setX:   setX,
        getX:   getX,
        setY:   setY,
        getY:   getY,
        draw:   draw
    };
};