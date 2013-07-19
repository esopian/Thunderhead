// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');

describe('Core', function(){
    before(function(){
        //strap up the client object before testing
        this.client = new thunderhead({
            username    : config.username,
            apikey      : config.apiKey,
            internalNet : config.internalNet,
            region      : config.region
        });
    });

    describe('Thunderhead construct', function(){
        it('client should exist', function(done){
            this.client.should.exist;
            done();
        });
    });

    describe('request should succeed with callback', function(){
        it('client should exist', function(done){
            done();
        });
    });

    describe('request should succeed with streaming', function(){
        it('client should exist', function(done){
            done();
        });
    });

    //TODO: test process arguments

});
