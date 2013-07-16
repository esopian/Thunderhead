/**
 *
 */

var _ = require('underscore');
var util = require('util');

function identity(options) {
	if(options && options.apikey) { this.apikey = options.apikey; }
	if(options && options.username) { this.username = options.username; }
	if(options && options.region) { this.region = options.region; }
	return this;
}
identity.prototype.constructor = identity;
module.exports = identity;


identity.prototype.endpoint = "https://identity.api.rackspacecloud.com/v2.0";
identity.prototype.access = null;
identity.prototype.token = null;
identity.prototype.region = null;
identity.prototype.internalNet = false;

identity.prototype.isAuthenticated = function(){
	if (this.access && (new Date() < new Date(this.access.token.expires))) return true;

	return false;
};

identity.prototype.authenticate = function(options, callback) {
	if(typeof options == 'function') { callback = options; }
	options = options || {};
	this.endpoint = options.endpoint || this.endpoint;
	this.apikey = options.apikey || this.apikey || "";
	this.username = options.username || this.username || "";
	this.access = null;

	var self = this;

	return this.request({
		skipAuth : true,
		url : "/tokens",
		method : "POST",
		data : {
			"auth" : {
				"RAX-KSKEY:apiKeyCredentials": {
					"username": this.username,
					"apiKey": this.apikey
				}
			}
		}
	}, function(error, reply) {
		if(error) return callback(error, reply);
		self.access = reply.access || null;
		self.token = reply.access.token || null;

		//Set Endpoints
		self.setRegion();

		return callback(null, self.access);
	});
};

identity.prototype.setRegion = function(options) {
    options = options || {};
	if(options.region) { this.region = options.region; }
    if(options.internalNet) { this.internalNet = options.internalNet; }
	var self = this;

	//Traverse services and set endpoints
	_.each(this._parent, function(service) {
		if(service.endpoint === undefined || service.serviceType === undefined) {return;}

		//Match on service type
		_.find(self.access.serviceCatalog, function(serviceInfo) {
			if(serviceInfo.type == service.serviceType) {
				//Pick the publicURL
				if(serviceInfo.endpoints.length == 1) {
					//If only one URL, attach anyway.
                    if(self.internalNet) {
                        service.endpoint = serviceInfo.endpoints[0].internalURL || serviceInfo.endpoints[0].publicURL;
                    } else {
                        service.endpoint = serviceInfo.endpoints[0].publicURL;
                    }
				} else {
					//Choose the URL based on region
					var endpoint = _.find(serviceInfo.endpoints, function(endpoint){
						return (endpoint.region == self.region);
					});
					if(endpoint) {
                        if(self.internalNet) {
                            service.endpoint = endpoint.internalUrl || endpoint.publicURL;
                        } else {
                            service.endpoint = endpoint.publicURL;
                        }
					} else {
						//No Matching region, pick first endpoint
                        if(self.internalNet) {
                            service.endpoint = serviceInfo.endpoints[0].internalURL || serviceInfo.endpoints[0].publicURL;
                        } else {
                            service.endpoint = serviceInfo.endpoints[0].publicURL;
                        }             
					}
					return true;
				}
			} else {
				return false;
			}
		});
	});
};
