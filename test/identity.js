// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');

describe('Identity', function(){
    var client;

    before(function(){
        //strap up the client object before testing
        client = new thunderhead({
            username    : config.username,
            apikey      : config.apiKey,
            internalNet : config.internalNet,
            region      : config.region
        });
    });

    describe('Thunderhead construct', function(){
        it('client should exist', function(done){
            client.should.exist;
            done();
        });
    });

    describe('identity exists', function(){
        it('identity should exist', function(done){
            client.identity.should.exist;
            done();
        });
    });

    describe('authenticated should succeed', function(){
        it('should pass authenticate', function(done){
            client.identity.authenticate(null, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

});
