var Player = function(initX, initY, initColor) {
    var id;
    var x = initX;
    var y = initY;
    var color = initColor;

    var setId = function(newId) {
        id = newId;
    };

    var getId = function() {
        return id;
    };

    var getColor = function() {
        return color;
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

    //todo: 10 durch Breite, Höhe des Players ersetzen
    var getAggregatedX = function() {
        return (4 * x) + (2 * 10);
    };

    //todo: 10 durch Breite, Höhe des Players ersetzen
    var getAggregatedY = function() {
        return (4 * y) + (2 * 10);
    };

    var draw = function(context) {
        context.fillRect(x, y, 10, 10);
    };

    return {
        setId:  setId,
        getId:  getId,
        getColor: getColor,
        setX:   setX,
        getX:   getX,
        setY:   setY,
        getY:   getY,
        getAggregatedX: getAggregatedX,
        getAggregatedY: getAggregatedY,
        draw:   draw
    };
};