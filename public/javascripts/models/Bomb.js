define(['models/Item'], function(Item) {
    function Bomb(x, y, size, color, obstacles, context, remoteBomberMen, localBomberMan) {
        Item.call(this, x, y, size, color);
        this.remoteBomberMen = remoteBomberMen;
        this.localBomberMan = localBomberMan;
        this.obstacles = obstacles;
        this.detonating = false;
        this.detonated = false;
        this.level = 1;
        var self = this;

        imageObj = new Image();
        imageObj.src = 'images/www.png';

        imageObj2 = new Image();
        imageObj2.src = 'images/cb.png';

        setTimeout(function() {
            for (var i = 0; i < self.obstacles.length; ++i) {  // Bomb (0, 50), Obstacle (0, 100)
                obstacle = self.obstacles[i];
                if (obstacle.destroyable
                    && self.x - (self.size * self.level) <= obstacle.x
                    && self.x + (self.size * self.level) >= obstacle.x
                    && self.y - (self.size * self.level) <= obstacle.y
                    && self.y + (self.size * self.level) >= obstacle.y
                   /* && obstacle.x > (self.x + self.size/2) && obstacle.x < (self.x - self.size/2)
                    && obstacle.y < (self.y + self.size/2) && obstacle.y > (self.y - self.size/2)
                    && obstacle.x > (self.x - self.size/2) && obstacle.x < (self.x + self.size/2)
                    && obstacle.y > (self.y - self.size/2) && obstacle.y < (self.y + self.size/2)*/
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
    Bomb.prototype.draw = function(context) {
        context.drawImage(imageObj2, 0, 0, 45, 45, this.x, this.y, 45, 45);
    }

    Bomb.prototype.drawBomb = function(context) {
        if (!this.detonating) {
            this.draw(context);

            //this.obstacles.push(this);
        } else {
            this.drawExplosion(context);
            //Remove of the bomb in the obstacle array
        }
    };

    Bomb.prototype.drawExplosion = function(context) {
        context.fillStyle = this.color;
        var north = true;
        var east = true;
        var south = true;
        var west = true;

        for( var k = 0; k < this.obstacles.length; k++){
            //if(!this.y <= this.obstacles[k].y) {
            //NORTH Check
            //check if there is one obstacle with x/y position north the bomb
            if (this.obstacles[k].x < (this.x + this.size) && this.obstacles[k].x > (this.x - this.size) &&
                this.obstacles[k].y == (this.y - this.size) ){
                north = false;
            }
            //EAST Check
            //check if there is one obstacle with x/y position east the bomb
            if (this.obstacles[k].y < (this.y + this.size) && this.obstacles[k].y > (this.y - this.size) && this.obstacles[k].x == (this.x + this.size) ){
                east = false;
            }
            //SOUTH Check
            //check if there is one obstacle with x/y position south the bomb
            if (this.obstacles[k].x > (this.x - this.size) && this.obstacles[k].x < (this.x + this.size) && this.obstacles[k].y == (this.y + this.size) ){
                south = false;
            }
            //WEST Check
            //check if there is one obstacle with x/y position west to the bomb
            if (this.obstacles[k].y > (this.y - this.size) && this.obstacles[k].y < (this.y + this.size) && this.obstacles[k].x == (this.x - this.size) ){
                west = false;
            }
        }
        //North drawing
        if(north) {
            //context.fillRect(this.x, this.y - (this.level * this.size), this.size, (2 * this.level) * this.size);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y - this.size, 45, 45);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y, 45, 45);

            north = true;
        }
        if(east) {
            //context.fillRect(this.x, this.y, (2 * this.level) * this.size, this.size);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x + this.size, this.y, 45, 45);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y, 45, 45);

            east = true;
        }
        if(south) {
            //context.fillRect(this.x, this.y, this.size, 2 * this.size);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y + this.size, 45, 45);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y, 45, 45);

            south = true;
        }
        if(west) {
            //context.fillRect(this.x, this.y, -(this.level) * this.size, this.size);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x - this.size, this.y, 45, 45);
            context.drawImage(imageObj, 0, 0, 45, 45, this.x, this.y, 45, 45);

            west = true;
        }

    };

    return Bomb;
});
