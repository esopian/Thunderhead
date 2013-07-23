// Test cases for core library behavior
var should      = require('should');
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');

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

        // it('should test request', function(done) {
        //     var request = require('request');
        //     var first = false;
        //     request({
        //         url : 'http://www.google.com',
        //         method : 'GET'
        //     }, function(){
        //         first = first || "CALLBACK";
        //         console.log(first);
        //     }).on('end', function(){
        //         first = first || "PIPE";
        //         console.log(first);
        //     });
        // });
    });


});
