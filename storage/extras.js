var zlib    = require('zlib');
var async   = require('async');
var dirWalk = require('./dirWalk');
var fs      = require('fs');
var events  = require('events');
var _       = require('underscore');
/**
 *
 */

module.exports = {
	/**
	 * Convienence method for setting CORS options
	 * @param {object}   options  { origin, maxage, customheaders }
	 * @param {Function} callback Function will be passed (error, reply) on completion
	 */
	setContainerCORS : function(options, callback) {
		if(!this.core.processArgs({
			required : ['container']
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		var headers = {};
		if (options.origin) { headers['X-Container-Meta-Access-Control-Allow-Origin'] = options.origin; }
		if (options.maxage) { headers['X-Container-Meta-Access-Control-Max-Age'] = options.maxage; }
		if (options.customheaders) { headers['X-Container-Meta-Access-Control-Allow-Headers'] = options.customheaders; }

		return this.editContainerMeta({
			container : options.container,
			meta : headers
		}, callback);
	},

	enableAccessLog : function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.editContainerMeta({
			container: options.container,
			meta: {
				'X-Container-Meta-Access-Log-Delivery' : 'TRUE'
			}
		}, callback);
	},

	disableAccessLog : function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.editContainerMeta({
			container: options.container,
			meta: {
				'X-Container-Meta-Access-Log-Delivery' : 'FALSE'
			}
		}, callback);
	},

	putCompressedObject : function(options, callback) {
		var self = this;
		if (!options.compress) return self.putObject(options, callback);

		if (options.data) {
            if(options.data.length <= 0) { return callback({Error: "Empty Buffer"}); }
			zlib.gzip(options.data, function(err, compressedObject) {
				if (err) return callback({error: err});
				options.data = compressedObject;
				if (!options.headers) options.headers = {};
				options.headers['Content-Encoding'] = 'gzip';
				return self.putObject(options, callback);
			});
		} else {
			//TODO: pipe to stream
		}
	},


	copyObjectWithHeaders : function(options, callback) {
		if(!this.core.processArgs({
			required : ['sourceObject','sourceContainer','destinationObject','destinationContainer']
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		var self = this;
        self.getObjectMeta({
			container : options.sourceContainer,
			object    : options.sourceObject
        }, function(err, reply) {
            if (err) return callback({ Message: "failed to get object meta", Error: err });

            var headers = _.extend({}, _.omit(reply, ['last-modified', 'etag', 'x-timestamp', 'x-trans-id']), options.headers || {});

            self.copyObject({
                headers              : headers,
                sourceObject         : options.sourceObject,
                sourceContainer      : options.sourceContainer,
                destinationObject    : options.destinationObject,
                destinationContainer : options.destinationContainer
            }, function(err, reply) {
                if (err) return callback({ Message: "failed to copy object", Error: err });
                return callback(null, reply);
            });
        });
	},


	emptyContainer : function(options, callback) {
		if(!this.core.processArgs({
			default : "container"
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		var self = this;
		(function cleanObjects() {
			self.listObjects(options.container, function(err, reply) {
				if(err) { return callback(err); }
				if((!reply.length) || reply.length <= 0) { return callback(null, {message:"Container Empty"}); }
				var objList = reply;

				(function popDelete(fObj){
					if (!fObj) return cleanObjects();
					self.deleteObject({
						object : fObj.name,
						container : options.container
					}, function(err, reply) {
						if(err) { return callback(err); }
						else if(objList.length > 0) { return popDelete(objList.pop());}
						else { return cleanObjects(); }
					});
				})(objList.pop());
			});
		})();
	},


    syncDir : function(options, callback) {
        if(!this.core.processArgs({
            required : ['container', 'directory']
        }, arguments)) { return callback({error:"Bad Arguments"}); }

        var emitter = new events.EventEmitter();

        var dir  = options.directory;
        var container = options.container;
        var self = this;

        dirWalk.parallel(dir, function(err, files){
            if(err) return callback(err);

            //copy all the files into the cloud
            async.eachLimit(files, 15,
                function(file, cb){ //Iterator Function
                    var remote = file.replace(dir,"").replace(/^\//,"");
                    fs.readFile(file, function(err,data){
                        if(err) { return cb(err); }
                        var reqObj = {
                            container : container,
                            object    : remote,
                            data      : data,
                            compress  : true,
                            headers   : {
                                "Access-Control-Allow-Origin" : "*"
                            }
                        };

                        self.putCompressedObject(reqObj, function(err, reply) {
                            if(err) return cb(err);
                            emitter.emit('sync', {
                                containter : container,
                                local      : file,
                                remote     : remote
                            });
                            return cb();
                        });
                    });
                },
                function(err) { //Finished Function
                    if(err) return callback(err);

                    emitter.emit('done');
                    return callback(null,files);
                }
            );
        });

        return emitter;
    }
};
