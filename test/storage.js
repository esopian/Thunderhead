// Test cases for core library behavior
var config      = require('./apiConfig');
var thunderhead = require('../thunderhead');
var should      = require('should');

describe('Storage', function(){
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

    describe('listContainers', function(){
        it('command should execute without error', function(done){
            client.storage.listContainers({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Array);
                done();
            });
        });
    });

    describe('accountDetails', function(){
        it('command should execute without error', function(done){
            client.storage.accountDetails({}, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });


    describe('createContainer', function(){
        it('command should execute without error', function(done){
            client.storage.createContainer('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('containerDetails', function(){
        it('command should execute without error', function(done){
            client.storage.containerDetails('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });


    describe('editContainerMeta', function(){
        it('command should execute without error', function(done){
            client.storage.editContainerMeta({
                container : 'test_container',
                meta      : {
                    'x-container-meta-test' : 'Test Value'
                }
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('setContainerCORS', function(){
        it('command should execute without error', function(done){
            client.storage.setContainerCORS({
                container     : 'test_container',
                origin        : '*',
                maxage        : 100,
                customheaders : 'X-Test'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('enableAccessLog', function(){
        it('command should execute without error', function(done){
            client.storage.enableAccessLog('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('disableAccessLog', function(){
        it('command should execute without error', function(done){
            client.storage.disableAccessLog('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('getContainerMeta', function(){
        it('command should execute without error', function(done){
            client.storage.getContainerMeta('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply['x-container-meta-test'                        ].should.equal('Test Value');
                reply['x-container-meta-access-control-allow-origin' ].should.equal('*');
                reply['x-container-meta-access-control-max-age'      ].should.equal('100');
                reply['x-container-meta-access-control-allow-headers'].should.equal('X-Test');
                reply['x-container-meta-access-log-delivery'         ].should.equal('FALSE');
                done();
            });
        });
    });


    describe('listObjects', function(){
        it('command should execute without error', function(done){
            client.storage.listObjects('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Array);
                done();
            });
        });
    });

    describe('putObject', function(){
        it('command should execute without error', function(done){
            client.storage.putObject({
                container : 'test_container',
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


    describe('getObject', function(){
        it('command should execute without error', function(done){
            client.storage.getObject({
                container : 'test_container',
                object    : 'test_object'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.equal("Test Value");
                done();
            });
        });
    });


    describe('editObjectMeta', function(){
        it('command should execute without error', function(done){
            client.storage.editObjectMeta({
                container : 'test_container',
                object    : 'test_object',
                meta      : {
                    'x-object-meta-test' : 'Test Value'
                }
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                // reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('getObjectMeta', function(){
        it('command should execute without error', function(done){
            client.storage.getObjectMeta({
                container : 'test_container',
                object    : 'test_object'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                reply['x-object-meta-test'].should.be.equal("Test Value");
                done();
            });
        });
    });


    describe('copyObject', function(){
        it('command should execute without error', function(done){
            client.storage.copyObject({
                sourceContainer      : 'test_container',
                sourceObject         : 'test_object',
                destinationContainer : 'test_container',
                destinationObject    : 'test_object2'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('getObjectMeta', function(){
        it('command should execute without error', function(done){
            client.storage.getObjectMeta({
                container : 'test_container',
                object    : 'test_object2'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('putCompressedObject', function(){
        it('command should execute without error', function(done){
            client.storage.putCompressedObject({
                container : 'test_container',
                object    : 'test_object2',
                data      : 'Test Value',
                compress  : true
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    describe('copyObjectWithHeaders', function(){
        it('command should execute without error', function(done){
            client.storage.copyObjectWithHeaders({
                sourceContainer      : 'test_container',
                sourceObject         : 'test_object2',
                destinationContainer : 'test_container',
                destinationObject    : 'test_object3'
            }, function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });

    // TODO: test deeper than call complete
    // TODO: syncDir


    describe('emptyContainer', function(){
        it('command should execute without error', function(done){
            client.storage.emptyContainer('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });


    describe('deleteContainer', function(){
        it('command should execute without error', function(done){
            client.storage.deleteContainer('test_container', function(err, reply) {
                should.not.exist(err);
                reply.should.exist;
                reply.should.be.an.instanceOf(Object);
                done();
            });
        });
    });



});
