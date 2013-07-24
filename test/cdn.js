// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');

describe('CDN', function(){
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

    describe('storage exists', function(){
        it('client should exist', function(done){
            client.storage.should.exist;
            done();
        });
    });

    describe('cdn exists', function(){
        it('client should exist', function(done){
            client.cdn.should.exist;
            done();
        });
    });


    describe('listContainers', function(){
        it('command should execute without error', function(done){
            client.cdn.listContainers({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Array);
                done();
            });
        });
    });

    describe('createContainer', function(){
        it('command should execute without error', function(done){
            client.storage.createContainer('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('enableContainer', function(){
        it('command should execute without error', function(done){
            client.cdn.enableContainer('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('enableLog', function(){
        it('command should execute without error', function(done){
            client.cdn.enableLog('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('disableLog', function(){
        it('command should execute without error', function(done){
            client.cdn.disableLog('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });


    describe('editContainerMeta', function(){
        it('command should execute without error', function(done){
            client.cdn.editContainerMeta({
                container : 'test_cdn_container',
                meta      : {
                    'x-ttl' : 900
                }
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('getContainerMeta', function(){
        it('command should execute without error', function(done){
            client.cdn.getContainerMeta('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply['x-ttl'].should.equal('900');
                done();
            });
        });
    });

    describe('putObject', function(){
        it('command should execute without error', function(done){
            client.storage.putObject({
                container : 'test_cdn_container',
                object    : 'test_object',
                data      : 'Test Value'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

/* This call gets rate limited so we probably don't want to call it every test
    describe('purgeObject', function(){
        it('command should execute without error', function(done){
            client.cdn.purgeObject({
                container : 'test_cdn_container',
                object    : 'test_object'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });
*/

    describe('emptyContainer', function(){
        it('command should execute without error', function(done){
            client.storage.emptyContainer('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('disableContainer', function(){
        it('command should execute without error', function(done){
            client.cdn.disableContainer('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('deleteContainer', function(){
        it('command should execute without error', function(done){
            client.storage.deleteContainer('test_cdn_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });


});
