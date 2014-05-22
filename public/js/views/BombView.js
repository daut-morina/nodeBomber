define(['views/ItemView'], function(ItemView) {
    function BombView(id, x, y, size, color) {
        ItemView.call(this, id, x, y, size, color);
        this.detonating = false;
        this.detonated = false;
        this.level = 1;
        var self = this;

        setTimeout(function() {
            self.detonating = true;
            setTimeout(function() {
                self.detonated = true;
            }, 1000);
        }, 3000);
    }

    BombView.prototype = new ItemView();

    BombView.prototype.drawBomb = function(context) {
        if (!this.detonating) {
            this.draw(context);
        } else {
            this.drawExplosion(context);
        }
    };

    BombView.prototype.drawExplosion = function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x - (this.level * this.size), this.y, (2 * this.level + 1) * this.size, this.size);
        context.fillRect(this.x, this.y - (this.level * this.size), this.size, (2 * this.level + 1) * this.size);
    };

    return BombView;
});

