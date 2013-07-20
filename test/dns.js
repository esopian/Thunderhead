// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');


describe('DNS', function(){
    var client;
    var domainId;
    var recordId;

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

    describe('dns exists', function(){
        it('client should exist', function(done){
            client.dns.should.exist;
            done();
        });
    });

    describe('listLimits', function(){
        it('command should execute without error', function(done){
            client.dns.listLimits({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listLimitTypes', function(){
        it('command should execute without error', function(done){
            client.dns.listLimitTypes({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listDomains', function(){
        it('command should execute without error', function(done){
            client.dns.listDomains({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('createDomain', function(){
        it('command should execute without error', function(done){
            client.dns.createDomain({
                name         : 'thunderheadunittest.com',
                emailAddress : 'domains@thunderheadunittest.com',
                ttl          : 900,
                recordsList  : {
                    records : [
                        {
                            ttl  : 900,
                            name : 'thunderheadunittest.com',
                            type : 'A',
                            data : '74.125.227.134'
                        },
                        {
                            ttl  : 900,
                            name : 'www.thunderheadunittest.com',
                            type : 'A',
                            data : '131.253.33.200'
                        }
                    ]
                }
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.domains.should.exist;
                reply.domains.should.be.an.instanceOf(Array);
                reply.domains[0].should.exist;
                reply.domains[0].should.be.an.instanceOf(Object);
                reply.domains[0].id.should.exist;
                domainId = reply.domains[0].id;
                done();
            });
        });
    });

    describe('editDomain', function(){
        it('command should execute without error', function(done){
            client.dns.editDomain({
                domainId : domainId,
                comment  : 'Test Value'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listRecords', function(){
        it('command should execute without error', function(done){
            client.dns.listRecords({
                domainId : domainId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('createRecord', function(){
        it('command should execute without error', function(done){
            client.dns.createRecord({
                domainId : domainId,
                ttl      : 900,
                type     : 'A',
                name     : 'test.thunderheadunittest.com',
                data     : '131.253.33.200'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply.records.should.exist;
                reply.records.should.be.an.instanceOf(Array);
                reply.records[0].should.exist;
                reply.records[0].should.be.an.instanceOf(Object);
                reply.records[0].id.should.exist;
                recordId = reply.records[0].id;
                done();
            });
        });
    });

    describe('editRecord', function(){
        it('command should execute without error', function(done){
            client.dns.editRecord({
                domainId : domainId,
                recordId : recordId,
                ttl      : 1800,
                type     : 'A',
                name     : 'test.thunderheadunittest.com',
                data     : '131.253.33.200'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listRecordDetails', function(){
        it('command should execute without error', function(done){
            client.dns.listRecordDetails({
                domainId : domainId,
                recordId : recordId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('deleteRecord', function(){
        it('command should execute without error', function(done){
            client.dns.deleteRecord({
                domainId : domainId,
                recordId : recordId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listSubdomains', function(){
        it('command should execute without error', function(done){
            client.dns.listSubdomains({
                domainId : domainId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listDomainDetails', function(){
        it('command should execute without error', function(done){
            client.dns.listDomainDetails({
                domainId : domainId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('listDomainChanges', function(){
        it('command should execute without error', function(done){
            client.dns.listDomainChanges({
                domainId : domainId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

// exportDomain

    describe('deleteDomain', function(){
        it('command should execute without error', function(done){
            client.dns.deleteDomain({
                domainId : domainId
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

// importDomain

});
