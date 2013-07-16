function cdn(options) {
	return this;
}
cdn.prototype.constructor = cdn;

cdn.prototype.serviceType = "rax:object-cdn";
cdn.prototype.endpoint = null;

//  _____                 _   _                 
// |  ___|   _ _ __   ___| |_(_) ___  _ __  ___ 
// | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
// |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

cdn.prototype.listContainers = function(options, callback) {
	if(!this.core.processArgs({}, arguments)) { return callback({error:"Bad Arguments"}); }

	var qs = {
		'format':'json',
		'enabled_only' : true
	};
	if(options.limit) qs.limit = options.limit;
	if(options.marker) qs.marker = options.marker;
	if(options.end_marker) qs.end_marker = options.end_marker;
	if(options.enabled_only !== undefined) qs.enabled_only = options.enabled_only;

	return this.request({
		qs : {'format':'json'}
	}, callback);
};

cdn.prototype.getContainerMeta = function(options, callback) {
	if(!this.core.processArgs({
		default : "container",
		required : ['container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "HEAD",
		url: options.container
	}, callback);
};


cdn.prototype.editContainerMeta = function(options, callback) {
	if(!this.core.processArgs({
		required : ['meta','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "POST",
		url: options.container,
		headers: options.meta || {},
		mergeHeaders : true
	},callback);
};

cdn.prototype.enableContainer = function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.request({
			method : "PUT",
			url: options.container, 
			headers: {
				'X-CDN-Enabled' : 'True',
				'X-TTL' : options.ttl || '900'
			},
			mergeHeaders : true
		}, callback);
	};

cdn.prototype.disableContainer = function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.request({
			method : "PUT",
			url: options.container, 
			headers: {
				'X-CDN-Enabled' : 'False',
				'X-TTL' : options.ttl || '900'
			},
			mergeHeaders : true
		}, callback);
	};

cdn.prototype.purgeObject = function(options, callback) {
	if(!this.core.processArgs({
		required : ['object','container']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method: "DELETE",
		url: options.container+'/'+options.object,
		mergeHeaders : true
	},callback);
};

//////////////////////////////////
// Return the module definition //
//////////////////////////////////
module.exports = cdn;