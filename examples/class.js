function Car(model, year, miles) { // a basic 'class'
    this.model  = model;
    this.year  = year;
    this.miles  = miles;

    this.toString = function() {
        return this.model + " has done " + this.miles + " miles.";
    }
}

var civic = new Car( "Honda Civic", 2009, 20000 );
var mondeo = new Car( "Ford Mondeo", 2010, 5000 );

console.log( civic.toString() );
console.log( mondeo.toString() );

function Car2(model, year, miles) { // a basic 'class' with a prototyped function
    this.model  = model;
    this.year  = year;
    this.miles  = miles;
}

Car2.prototype.toString = function() {
    return this.model + " has done " + this.miles + " miles."; // sort of static function
}

var civic = new Car2( "Honda Civic", 2009, 20000 );
var mondeo = new Car2( "Ford Mondeo", 2010, 5000 );

console.log( civic.toString() );
console.log( mondeo.toString() );