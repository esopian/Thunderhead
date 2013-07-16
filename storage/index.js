/**
 *
 */

function storage(options) {
	return this;
}
storage.prototype.constructor = storage;

storage.prototype.serviceType = "object-store";
storage.prototype.endpoint = null;

storage.prototype.listContainers = function(options, callback) {
	if(!this.core.processArgs({}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({}, callback);
};

storage.prototype.accountDetails = function(options, callback) {
	if(!this.core.processArgs({}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method:"HEAD"
	}, callback);
};

storage.prototype.containerDetails = function(options, callback) {
    if(!this.core.processArgs({
        default : "container"
    }, arguments)) { return callback({error:"Bad Arguments"}); }

    return this.request({
        method: "HEAD",
        url: "/"+options.container
    }, callback);
};


storage.prototype.createContainer = function(options, callback) {
	if(!this.core.processArgs({
		default : "container"
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "PUT",
		url: "/"+options.container
	}, callback);
};

storage.prototype.deleteContainer = function(options, callback) {
	if(!this.core.processArgs({
		default : "container"
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "DELETE",
		url: "/"+options.container
	}, callback);
};

storage.prototype.editContainerMeta = function(options, callback) {
	if(!this.core.processArgs({
		required : ['meta','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "POST",
		url: "/"+options.container,
		headers: options.meta || {}
	},callback);
};

storage.prototype.getContainerMeta = function(options, callback) {
	if(!this.core.processArgs({
		default : "container"
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "HEAD",
		url: "/"+options.container
	}, callback);
};

storage.prototype.listObjects = function(options, callback) {
	if(!this.core.processArgs({
		default : "container"
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	if(options.search) { options.container += "?"+options.search; }

	return this.request({
		url: options.container
	}, callback);
};

storage.prototype.getObject = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	options.headers = {};
	if(options.offset) { options.headers = {"Range": "bytes="+options.offset}; }

	return this.request({
		url: options.container+"/"+options.object,
		headers : options.headers
	}, callback);
};

storage.prototype.putObject = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container','data']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	options.headers = options.headers || {};

	//TODO: Detect Content Type
	if (!options.mime) {
		var mimeType = this.core.getMime(options.object);
		if(mimeType) options.headers['Content-Type'] = mimeType;
	} else {
		options.headers['Content-Type'] = options.mime;
	}

	//TODO: expire time (deleteafter, deleteat)
	if(options.deleteAfter) { options.headers['X-Delete-After'] = options.deleteAfter;}
	if(options.deleteAt) { options.headers['X-Delete-At'] = options.deleteAt;}

	//TODO: Downloadable switch for "Content-Disposition: attachment; filename=platmap.tif"
	if(options.downloadable) {
		if(/\//.test(options.object)) {
			options.headers['Content-Disposition'] = "attachment; filename="+options.object ;
		} else {
			options.headers['Content-Disposition'] = "attachment; filename="+options.object.substr(options.object.lastIndexOf('/')+1) ;
		}
	} else if (options.inline) {
		if(/\//.test(options.object)) {
			options.headers['Content-Disposition'] = "inline; filename="+options.object ;
		} else {
			options.headers['Content-Disposition'] = "inline; filename="+options.object.substr(options.object.lastIndexOf('/')+1) ;
		}
	}
	if (options.data.length) {
		return this.request({
			method: "PUT",
			url : options.container+"/"+options.object,
			headers : options.headers,
			data : options.data
		}, callback);
	} else callback(null, 'DONE');
};

storage.prototype.copyObject = function(options, callback) {
	if(!this.core.processArgs({
		required : ['sourceObject','sourceContainer','destinationObject','destinationContainer']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	options.headers = options.headers || {};
	options.headers.Destination = "/" + options.destinationContainer + "/" + options.destinationObject;

	return this.request({
		method  : "COPY",
		url     : options.sourceContainer + "/" + options.sourceObject,
		headers : options.headers
	}, callback);
};

storage.prototype.deleteObject = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var url = options.container+"/"+options.object;

	return this.request({
		method: "DELETE",
		url: url
	}, callback);
};

storage.prototype.getObjectMeta = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var url = options.container+"/"+options.object;

	return this.request({
		method:"HEAD",
		url:url
	}, callback);
};

storage.prototype.editObjectMeta = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container','meta']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "POST",
		url: options.container+"/"+options.object,
		headers: options.meta || {}
	},callback);
};

module.exports = storage;
