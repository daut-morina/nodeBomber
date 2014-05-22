define(['models/Item'], function(Item) {
    function Bomb(id, x, y, size, socket, items) {
        Item.call(this, id, x, y, size, socket);

        this.items = items;
        this.detonating = false;
        this.detonated = false;
        this.level = 1;
        this.once = 1;
        var self = this;

        console.log(self.items.obstacles);

        setTimeout(function() {
            self.detonating = true;

            /*
            if (self.isLocalBomb()) {
                self.socket.emit("bomb detonating", { id: self.id });
            }
            */

            for (var i = 0; i < self.items.obstacles.length; ++i) {  // Bomb (0, 50), Obstacle (0, 100)
                obstacle = self.items.obstacles[i];

                if (obstacle.destroyable && ((
                    self.x - (self.size * self.level) <= obstacle.x &&
                    self.x + (self.size * self.level) + self.size > obstacle.x &&
                    self.y <= obstacle.y &&
                    self.y + self.size > obstacle.y) || (
                    self.x <= obstacle.x &&
                    self.x + self.size > obstacle.x &&
                    self.y - (self.size * self.level) <= obstacle.y &&
                    self.y + (self.size * self.level) + self.size > obstacle.y))
                    ) {
                    console.log("obstacle exploded");
                    self.socket.emit("obstacle exploded", { id: obstacle.id });
                    self.items.obstacles.splice(i, 1);
                    self.items.obstacles.splice(self.items.obstacles.indexOf(self), 1);
                    //self.items.obstacles.splice(self.items.bombs.indexOf(self), 1);
                }
            }

            console.log("bombermen: " + self.items.bomberMen.length);

            console.log(self.items.bomberMen);

            for (var i = 0; i < self.items.bomberMen.length; ++i) {
                bomberman = self.items.bomberMen[i];

                console.log(bomberman);

                if ((
                    self.x - (self.size * self.level) <= bomberman.x &&
                        self.x + (self.size * self.level) + self.size > bomberman.x &&
                        self.y <= bomberman.y &&
                        self.y + self.size > bomberman.y) || (
                    self.x <= bomberman.x &&
                        self.x + self.size > bomberman.x &&
                        self.y - (self.size * self.level) <= bomberman.y &&
                        self.y + (self.size * self.level) + self.size > bomberman.y)
                    ) {
                    console.log("bomberman hit");
                    self.socket.emit("bomberman hit", { id: bomberman.id });
                    self.items.bomberMen.splice(i, 1);
                    //if (bomberman.id === )
                    //self.items.obstacles.splice(self.items.bombs.indexOf(self), 1);
                }

                console.log(self.items.bomberMen);
            }

            setTimeout(function() {
                self.detonated = true;

                /*
                if (self.isLocalBomb()) {
                    self.socket.emit("bomb detonated", { id: self.id });
                }
                */
            }, 1000);
        }, 3000);
    }

    Bomb.prototype = new Item();

    Bomb.prototype.isLocalBomb = function() {
        if (this.id.indexOf(this.socket.socket.sessionid) > -1) {
            return true;
        }

        return false;
    };

    Bomb.prototype.blasts;

    Bomb.prototype.getItemById = function(id, array) {
        for (var i = 0; i < array.length; ++i) {
            if (id === array[i].id) {
                return array[i];
            }
        }

        return false;
    };

    return Bomb;
});

