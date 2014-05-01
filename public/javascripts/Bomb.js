/**
 * Created by fabiolaib on 10.04.14.
 */
var Bomb = function(initX, initY, bombContext) {
    var id;
    var x = initX;
    var y = initY;
    var detonate = false;
    var exploded = false;
    var timer2 = null;
    var bContext = bombContext;
    var drawExplosion = false;

    var boom = function() {
        //setTimeout(explosion, 1500);
        detonate = true;
        drawExplosion = true;
    };
    var explode = function() {
        exploded = true;
    };

    setTimeout(boom, 3000);

    var getDetonate = function() {
        return detonate;
    };
    var getExploded = function() {
        return exploded;
    };
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
    var explosion = function() {
        bContext.fillRect(x, y, 10, 60);
        bContext.fillRect(x, y, 10, -50);
        bContext.fillRect(x, y, 60, 10);
        bContext.fillRect(x, y, -50, 10);
        drawExplosion = true;
        explode();
        setTimeout(function() {
            drawExplosion = false;
        }, 1000)
    };

    var getY = function() {
        return y;
    };

    var draw = function() {
        bContext.fillRect(x, y, 10, 10);
        setTimeout(explosion, 2000);
    };

    var getContext = function () {
        return bContext;
    };

    return {
        timer2:     timer2,
        bContext:    bContext,
        boom:       boom,
        explosion:  explosion,
        getContext: getContext,
        getDetonate: getDetonate,
        getExploded: getExploded,
        setId:       setId,
        getId:      getId,
        setX:       setX,
        getX:       getX,
        setY:       setY,
        getY:       getY,
        draw:       draw,
        drawExplosion: drawExplosion
    };
};