define(['models/Item'], function(Item) {
    function Bomb(x, y, size, color, obstacles, context) {
        Item.call(this, x, y, size, color);
        this.obstacles = obstacles;
        this.detonating = false;
        this.detonated = false;
        this.level = 1;
        var self = this;

        setTimeout(function() {
            var obstacle;

            for (var i = 0; i < self.obstacles.length; ++i) {  // Bomb (0, 50), Obstacle (0, 100)
                obstacle = self.obstacles[i];
                if (obstacle.destroyable
                    && self.x - (self.size * self.level) <= obstacle.x
                    && self.x + (self.size * self.level) >= obstacle.x
                    && self.y - (self.size * self.level) <= obstacle.y
                    && self.y + (self.size * self.level) >= obstacle.y
                    ) {
                    self.obstacles.splice(i, 1);
                    obstacle.erase(context);
                }
            }

            self.detonating = true;

            setTimeout(function() {
                self.detonated = true;
            }, 1000)
        }, 3000);
    }

    Bomb.prototype = new Item();

    Bomb.prototype.drawBomb = function(context) {
        if (!this.detonating) {
            this.draw(context);
        } else {
            this.drawExplosion(context);
        }
    };

    Bomb.prototype.drawExplosion = function(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x - (this.level * this.size), this.y, (2 * this.level + 1) * this.size, this.size);
        context.fillRect(this.x, this.y - (this.level * this.size), this.size, (2 * this.level + 1) * this.size);
    };

    return Bomb;
});

