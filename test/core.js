// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');

describe('Core', function(){
    before(function(){
        //strap up the client object before testing
        this.client = new thunderhead({
            username    : config.username,
            apikey      : config.apikey,
            internalNet : config.internalNet,
            region      : config.region
        });
    });

    it('client should exist', function(done){
        this.client.should.exist;
        done();
    });

});