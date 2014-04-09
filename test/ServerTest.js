var chai = require('chai');
var assert = chai.assert;

var http = require('http');

require('../app');

describe('Server', function() {

    before(function() {

    });

    after(function() {
        //server.close();
    });

    it("should return index", function() {
        http.get({ host: "127.0.0.1", port: 3000, path: "/" }, function(response) {
            assert.equal(200, response.statusCode, "Should return 200, returned " + response.statusCode + " instead.");
            response.setEncoding('utf8');
            response.on('data', function(body) {
                assert.include(body, "Bomb", "wrong content");
            });
        }).on('error', function(error) {
            console.log("Got error: " + error.message);
        });
    });

    it("should return playground", function() {
        http.get({ host: "127.0.0.1", port: 3000, path: "/playground" }, function(response) {
            assert.equal(200, response.statusCode, "Should return 200, returned " + response.statusCode + " instead.");
            response.setEncoding('utf8');
            response.on('data', function(body) {
                assert.include(body, "playerCanvas", "not returning html");
            });
        }).on('error', function(error) {
            console.log("Got error: " + error.message);
        });
    });

    it("should return 404", function() {
        http.get({ host: "127.0.0.1", port: 3000, path: "/random" }, function(response) {
           assert.equal(404, response.statusCode, "Should return 404, return " + response.statusCode + " instead.");
        });
    })

});
