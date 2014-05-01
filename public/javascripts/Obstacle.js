var Obstacle = function(initX, initY, initIsDestroyable) {
    var id;
    var x = initX;
    var y = initY;
    var isDestroyable = initIsDestroyable || false;

    console.log("isDestroyable: " + isDestroyable);

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

    var setDestroyable = function(newIsDestroyable) {
        isDestroyable = newIsDestroyable;
    };

    var isDestroyable = function() {
        return isDestroyable;
    };

    var draw = function(context) {
        context.fillRect(x, y, 20, 20);
    };

    return {
        setId:  setId,
        getId:  getId,
        setX:   setX,
        getX:   getX,
        setY:   setY,
        getY:   getY,
        setDestroyable: setDestroyable,
        isDestroyable: isDestroyable,
        draw:   draw
    };
};