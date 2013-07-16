/**
 *
 */
var _ = require('underscore');

/**
 * Main Thunderhead Contructor
 * @param  {object} options [description]
 * @return {object}	self
 */
function thunderhead(options) {
	//Load Default Options
	options = options || {};
	options.extras = (options.extras !== undefined) ? options.extras : true;

	this.core = new core();
	this.core._parent = this;
	//Available Service List
	this.services = {
		'identity' : './identity',
		'storage'  : './storage',
		'dns'      : './dns',
		'cdn'	   : './cdn',
		'lb'       : './lb'
	};

	//Load Services List
	options.services = options.services || _.keys(this.services);
	//Always load Identity
	options.services = _.reject(options.services, function(service){ return (service == "identity"); });
	var identityClass = require(this.services.identity);
	identityClass.prototype.request = this.core.requestBuilder;
	identityClass.prototype.requestAsync = this.core.requestAsyncBuilder;
	if(options.username && options.apikey) {
        var identity_options = {
            username : options.username,
            apikey : options.apikey,
            region : options.region || "ORD"
        };
        if(options.internalNet) identity_options.internalNet = true;

		this.core.identity = this.identity = new identityClass(identity_options);
	} else {
		this.core.identity = this.identity = new identityClass();
	}
	this.identity.core = this.core;
	this.identity._parent = this;

	//Build Services on thunderhead stack
	var self = this;
	_.each(options.services, function(service){
		var serviceClass = require(self.services[service]);
		serviceClass.prototype.request = self.core.requestBuilder;
		serviceClass.prototype.requestAsync = self.core.requestAsyncBuilder;
		self[service] = new serviceClass();
		self[service].core = self.core;
		self[service]._parent = self;
		if(options.extras) { 
			try {
				var extras = require(self.services[service]+"/extras");
				if(extras) { _.extend(self[service], extras); }
			} catch(err) {
				//Unable to load extras library
			}
		}
	});

}
thunderhead.prototype.constructor = thunderhead;

var core = require('./core');

module.exports = thunderhead;