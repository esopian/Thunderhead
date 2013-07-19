function lb(options) {
	return this;
}
lb.prototype.constructor = lb;

lb.prototype.serviceType = "rax:load-balancer";
lb.prototype.endpoint = null;

//  _____                 _   _
// |  ___|   _ _ __   ___| |_(_) ___  _ __  ___
// | |_ | | | | '_ \ / __| __| |/ _ \| '_ \/ __|
// |  _|| |_| | | | | (__| |_| | (_) | | | \__ \
// |_|   \__,_|_| |_|\___|\__|_|\___/|_| |_|___/

lb.prototype.listLimits = function(options, callback) {
	if(!this.core.processArgs({
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: "limits"
	}, callback);
};

lb.prototype.listAllowedDomains = function(options, callback) {
    if(!this.core.processArgs({
    }, arguments)) { return callback({error:"Bad Arguments"}); }

    return this.request({
        url: "loadbalancers/alloweddomains"
    }, callback);
};

lb.prototype.listAbsoluteLimits = function(options, callback) {
	if(!this.core.processArgs({
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: "loadbalancers/absolutelimits"
	}, callback);
};

lb.prototype.listLB = function(options, callback) {
	if(!this.core.processArgs({
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: "loadbalancers"
	}, callback);
};

lb.prototype.getSSLDetails = function(options, callback) {
    if(!this.core.processArgs({
        default: 'loadBalancerId',
        required: ['loadBalancerId']
    }, arguments)) { return callback({error:"Bad Arguments"}); }

    return this.request({
        url: 'loadbalancers/'+options.loadBalancerId+"/ssltermination"
    }, callback);
};

lb.prototype.listLBDetails = function(options, callback) {
	if(!this.core.processArgs({
		default: 'loadBalancerId',
		required: ['loadBalancerId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: 'loadbalancers/'+options.loadBalancerId
	}, callback);
};

lb.prototype.createLB = function(options, callback) {
	if(!this.core.processArgs({
		required: ['name','nodes','virtualIps']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var reqObj = {};
	//Required
	reqObj.name = options.name;
	reqObj.nodes = options.nodes;
	reqObj.virtualIps = options.virtualIps;
	//Defaults
	reqObj.protocol = options.protocol || "HTTP";
	//Optional
	if(options.accessList) reqObj.accessList = options.accessList;
	if(options.algorithm) reqObj.algorithm = options.algorithm;
	if(options.connectionLogging) reqObj.connectionLogging = options.connectionLogging;
	if(options.connectionThrottle) reqObj.connectionThrottle = options.connectionThrottle;
	if(options.healthMonitor) reqObj.healthMonitor = options.healthMonitor;
	if(options.metadata) reqObj.metadata = options.metadata;
	if(options.port) reqObj.port = options.port;
	if(options.timeout) reqObj.timeout = options.timeout;
	if(options.sessionPersistence) reqObj.sessionPersistence = options.sessionPersistence;


	return this.request({
		method : "POST",
		url: 'loadbalancers',
		data: reqObj
	}, callback);
};

lb.prototype.editLB = function(options, callback) {
	if(!this.core.processArgs({
		default : 'loadBalancerId',
		required : ['loadBalancerId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var reqObj = {};
	//Optional
	if(options.name) reqObj.name = options.name;
	if(options.algorithm) reqObj.algorithm = options.algorithm;
	if(options.protocol) reqObj.protocol = options.protocol;
	if(options.port) reqObj.port = options.port;
	if(options.timeout) reqObj.timeout = options.timeout;

	return this.request({
		method : "PUT",
		url: 'loadbalancers/'+options.loadBalancerId,
		data: reqObj
	}, callback);
};

lb.prototype.deleteLB = function(options, callback) {
	if(!this.core.processArgs({
		default : 'loadBalancerId',
		required : ['loadBalancerId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method : "DELETE",
		url: 'loadbalancers/'+options.loadBalancerId
	}, callback);
};

lb.prototype.addNode = function(options, callback) {
    if(!this.core.processArgs({
        default : 'loadBalancerId',
        required : ['loadBalancerId','address','condition','port']
    }, arguments)) { return callback({error:"Bad Arguments"}); }

    var reqObj = {};
    //Optional
    if(options.address) reqObj.address = options.address;
    if(options.condition) reqObj.condition = options.condition;
    if(options.port) reqObj.port = options.port;
    if(options.type) reqObj.type = options.type;
    if(options.weight) reqObj.weight = options.weight;

    return this.request({
        method : "POST",
        url: 'loadbalancers/'+options.loadBalancerId+"/nodes",
        data: { "nodes" : [reqObj] }
    }, callback);
};


lb.prototype.getHealthMonitorLB = function(options, callback) {
	if(!this.core.processArgs({
		default  : 'loadBalancerId',
		required : ['loadBalancerId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method : "GET",
		url: 'loadbalancers/'+options.loadBalancerId+'/healthmonitor'
	}, callback);
};

lb.prototype.editHealthMonitorLB = function(options, callback) {
	if(!this.core.processArgs({
		required : [
			'loadBalancerId',
			'attemptsBeforeDeactivation',
			'delay',
			'timeout',
			'type'
		]
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var reqObj = {};
	if(options.attemptsBeforeDeactivation) reqObj.attemptsBeforeDeactivation = options.attemptsBeforeDeactivation;
	if(options.delay)                      reqObj.delay                      = options.delay;
	if(options.timeout)                    reqObj.timeout                    = options.timeout;
	if(options.type)                       reqObj.type                       = options.type;
	if(options.path)                       reqObj.path                       = options.path;
	if(options.bodyRegex)                  reqObj.bodyRegex                  = options.bodyRegex;
	if(options.statusRegex)                reqObj.statusRegex                = options.statusRegex;
	if(options.hostHeader)                 reqObj.hostHeader                 = options.hostHeader;

	return this.request({
		method : "PUT",
		url: 'loadbalancers/'+options.loadBalancerId+'/healthmonitor',
		data: reqObj
	}, callback);
};

lb.prototype.deleteHealthMonitorLB = function(options, callback) {
	if(!this.core.processArgs({
		default  : 'loadBalancerId',
		required : ['loadBalancerId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		method : "DELETE",
		url: 'loadbalancers/'+options.loadBalancerId+'/healthmonitor'
	}, callback);
};


//////////////////////////////////
// Return the module definition //
//////////////////////////////////
module.exports = lb;
