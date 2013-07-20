// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');


describe('LB', function(){
    var client;
    var lbId;


    var waitForActive = function(done) {
        var attempts = 0;
        var wait     = 2000;
        var maxTries = 10;

        var testLB = function() {
            attempts++;
            (attempts < maxTries).should.be.true
            client.lb.listLBDetails({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.loadBalancer.should.exist;
                reply.loadBalancer.should.be.an.instanceOf(Object);
                if (reply.loadBalancer.status == 'ACTIVE') return done();
                else return setTimeout(testLB, wait);
            });
        };
        setTimeout(testLB, wait);
    };


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

    describe('lb exists', function(){
        it('client should exist', function(done){
            client.lb.should.exist;
            done();
        });
    });


    describe('listLimits', function(){
        it('command should execute without error', function(done){
            client.lb.listLimits({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listAllowedDomains', function(){
        it('command should execute without error', function(done){
            client.lb.listAllowedDomains({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.allowedDomains.should.exist;
                reply.allowedDomains.should.be.an.instanceOf(Array);
                done();
            });
        });
    });

    describe('listAbsoluteLimits', function(){
        it('command should execute without error', function(done){
            client.lb.listAbsoluteLimits({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.absolute.should.exist;
                reply.absolute.should.be.an.instanceOf(Array);
                done();
            });
        });
    });

    describe('listLB', function(){
        it('command should execute without error', function(done){
            client.lb.listLB({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.loadBalancers.should.exist;
                reply.loadBalancers.should.be.an.instanceOf(Array);
                done();
            });
        });
    });


    describe('createLB', function(){
        it('command should execute without error', function(done){
            client.lb.createLB({
                name       : 'test-loadbalancer',
                protocol   : 'HTTP',
                virtualIps : [
                    {
                        type : 'PUBLIC'
                    }
                ],
                'nodes': [
                    {
                        address   : '74.125.227.134', //NOTE: google.com ping response IP at time of writing
                        port      : 80,
                        condition : 'ENABLED'
                    }
                ]
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.loadBalancer.should.exist;
                reply.loadBalancer.id.should.exist;
                lbId = reply.loadBalancer.id;
                waitForActive(done);
            });
        });
    });

    describe('editLB', function(){
        it('command should execute without error', function(done){
            client.lb.editLB({
                loadBalancerId : lbId,
                name           : 'test-loadbalancer2'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                waitForActive(done);
            });
        });
    });

    describe('addNode', function(){
        it('command should execute without error', function(done){
            client.lb.addNode({
                loadBalancerId : lbId,
                address        : '131.253.33.200', //NOTE: bing.com ping response IP at time of writing
                condition      : 'ENABLED',
                port           : 80
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                waitForActive(done);
            });
        });
    });

/* TODO: this won't pass until we write setSSLDetails
    describe('getSSLDetails', function(){
        it('command should execute without error', function(done){
            client.lb.getSSLDetails({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });
*/

    describe('listLBDetails', function(){
        it('command should execute without error', function(done){
            client.lb.listLBDetails({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('editHealthMonitorLB', function(){
        it('command should execute without error', function(done){
            client.lb.editHealthMonitorLB({
                loadBalancerId             : lbId,
                attemptsBeforeDeactivation : 2,
                delay                      : 3600,
                timeout                    : 60,
                type                       : 'CONNECT'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                waitForActive(done);
            });
        });
    });

    describe('getHealthMonitorLB', function(){
        it('command should execute without error', function(done){
            client.lb.getHealthMonitorLB({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('deleteHealthMonitorLB', function(){
        it('command should execute without error', function(done){
            client.lb.deleteHealthMonitorLB({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                waitForActive(done);
            });
        });
    });

    describe('deleteLB', function(){
        it('command should execute without error', function(done){
            client.lb.deleteLB({
                loadBalancerId : lbId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });



});
