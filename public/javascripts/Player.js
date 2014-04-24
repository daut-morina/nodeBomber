var Player = function(initX, initY) {
    var id;
    var x = initX;
    var y = initY;

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
        setId:  setId,
        getId:  getId,
        setX:   setX,
        getX:   getX,
        setY:   setY,
        getY:   getY,
        draw:   draw
    };
};