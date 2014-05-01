function Item(initX, initY, size, initColor) {
    this.x = initX;
    this.y = initY;
    this.size = size;
    this.color = initColor;
    this.id = ' ';
}


Item.prototype = {
    setX: function(newX) {
        this.x = newX;
    },

    getX: function() {
        return this.x;
    },

        setY: function(newY) {
        this.y = newY;
    },

    getY: function() {
        return this.y;
    },

    draw: function(context) {
        context.fillRect(this.x, this.y, this.size, this.size);
    },

    getColor:  function() {
        return this.color;
    },

    setId: function(newId) {
        this.id = newId;
    },

    getId: function() {
        return this.id;
    }
};

function extend(target, source) {
    Object.getOwnPropertyNames(source)
        .forEach(function(propName) {
            Object.defineProperty(target, propName,
                Object.getOwnPropertyDescriptor(source, propName));
        });
    return target;
}

function inherits(SubC, SuperC) {
    var subProto = Object.create(SuperC.prototype);
    // At the very least, we keep the "constructor" property
    // At most, we keep additions that have already been made
    extend(subProto, SubC.prototype);
    SubC.prototype = subProto;
};

//module.exports = Item;
