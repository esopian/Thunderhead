var url = require('url');

function dns(options) {
	return this;
}
dns.prototype.constructor = dns;

dns.prototype.serviceType = "rax:dns";
dns.prototype.endpoint = null;

//  _     _           _ _
// | |   (_)_ __ ___ (_) |_ ___
// | |   | | '_ ` _ \| | __/ __|
// | |___| | | | | | | | |_\__ \
// |_____|_|_| |_| |_|_|\__|___/


dns.prototype.listLimits = function(options, callback) {
	if(!this.core.processArgs({
		default : "type"
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: "limits/"+(options.type || "")
	}, callback);
};

dns.prototype.listLimitTypes = function(options, callback) {
	if(!this.core.processArgs({}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url: "limits/types"
	}, callback);
};

//  ____                        _
// |  _ \  ___  _ __ ___   __ _(_)_ __  ___
// | | | |/ _ \| '_ ` _ \ / _` | | '_ \/ __|
// | |_| | (_) | | | | | | (_| | | | | \__ \
// |____/ \___/|_| |_| |_|\__,_|_|_| |_|___/


dns.prototype.listDomains = function(options, callback) {
	if(!this.core.processArgs({}, arguments)) { return callback({error:"Bad Arguments"}); }

	var urlParams = {};
	if(options.limit) { urlParams.limit = options.limit; }
	if(options.offset) { urlParams.offset = options.offset; }
	if(options.name) { urlParams.name = options.name; }

	return this.request({
		url: "domains",
		qs : urlParams
	}, callback);
};

dns.prototype.listSubdomains = function(options, callback) {
	if(!this.core.processArgs({
		default : 'domainId',
		required : ['domainId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var urlParams = {};
	if(options.limit) { urlParams.limit = options.limit; }
	if(options.offset) { urlParams.offset = options.offset; }

	return this.request({
		url : "domains/"+options.domainId+"/subdomains",
		qs : urlParams
	}, callback);
};

dns.prototype.listDomainDetails = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url : "domains/"+options.domainId,
		qs : {
			'showRecords' : options.records || ""
		}
	}, callback);
};

dns.prototype.listDomainChanges = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url : "domains/"+options.domainId,
		qs : { 'since' : options.since || '' }
	}, callback);
};

dns.prototype.exportDomain = function(options, callback) {
	if(!this.core.processArgs.call(this, {
		required : ['domainId'],
		default : 'domainId'
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.requestAsync({
		url : "domains/"+options.domainId+"/export"
	}, callback);
};

/**
 * Imports a full domain to rackspace DNS.  Only supports BIND_9 format
 * @param  {Object | String}   options
 * @param  {Function} callback
 * @return {Stream}             Streamable interface
 */
dns.prototype.importDomain = function(options, callback) {
	if(!this.core.processArgs({
		required : ['contents'],
		default : 'contents'
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.requestAsync({
		method : "POST",
		url : "domains/import",
		data : {
			domains : [
				{
					contents : options.content,
					contentType : "BIND_9"
				}
			]
		}
	}, callback);
};

/**
 * Create a single domain
 * @param  {Object}   options  Arguments for new domain
 * @param  {Function} callback Callback triggered on success or failure of call
 */
dns.prototype.createDomain = function(options, callback) {
	if(!this.core.processArgs({
		required : ['name','emailAddress']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	//TODO: Accept Multiple Domain Records
	//TODO: Accept Multiple Sub-Domain Records

	return this.requestAsync({
		method : "POST",
		url : "domains",
		data : {
			domains: [
				options
			]}
	}, callback);

};


dns.prototype.deleteDomain = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId'],
		default : 'domainId'
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.requestAsync({
		method : "DELETE",
		url : "domains/"+options.domainId,
		qs : { 'deleteSubdomains' : options.deleteSubdomains || false }
	}, callback);
};

dns.prototype.editDomain = function(options, callback)  {
	if(!this.core.processArgs({
		required : ['domainId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	//Slice out domainId from request
	var domainId = options.domainId;
	delete options.domainId;

	return this.requestAsync({
		method : "PUT",
		url : "domains/"+options.domainId,
		data : options
	}, callback);
};

//  ____                        _
// |  _ \ ___  ___ ___  _ __ __| |___
// | |_) / _ \/ __/ _ \| '__/ _` / __|
// |  _ <  __/ (_| (_) | | | (_| \__ \
// |_| \_\___|\___\___/|_|  \__,_|___/

dns.prototype.listRecords = function(options, callback) {
	if(!this.core.processArgs({
		default : 'domainId',
		required : ['domainId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var urlParams = {};
	if(options.limit) { urlParams.limit = options.limit; }
	if(options.offset) { urlParams.offset = options.offset; }
	if(options.type) { urlParams.type = options.type; }
	if(options.name) { urlParams.name = options.name; }
	if(options.data) { urlParams.data = options.data; }

	return this.request({
		url : "domains/"+options.domainId+"/records",
		qs : urlParams
	}, callback);
};

dns.prototype.listRecordDetails = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId', 'recordId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.request({
		url : "domains/"+options.domainId+"/records/"+options.recordId
	}, callback);
};

dns.prototype.createRecord = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId', 'type', 'name', 'data']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var domainId = options.domainId;
	delete options.domainId;

	return this.requestAsync({
		method : "POST",
		url : "domains/"+domainId+"/records",
		data : {
			records : [
				options
			]
		}
	}, callback);
};

dns.prototype.editRecord = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId', 'recordId', 'type', 'name', 'data']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	var domainId = options.domainId;
	var recordId = options.recordId;
	delete options.domainId;
	delete options.recordId;

	return this.requestAsync({
		method : "PUT",
		url : "domains/"+domainId+"/records/"+recordId,
		data : options
	}, callback);
};

dns.prototype.deleteRecord = function(options, callback) {
	if(!this.core.processArgs({
		required : ['domainId', 'recordId']
	}, arguments)) { return callback({error:"Bad Arguments"}); }

	return this.requestAsync({
		method : "DELETE",
		url : "domains/"+options.domainId+"/records/"+options.recordId,
	}, callback);
};

//  ____                                ____  _   _ ____
// |  _ \ _____   _____ _ __ ___  ___  |  _ \| \ | / ___|
// | |_) / _ \ \ / / _ \ '__/ __|/ _ \ | | | |  \| \___ \
// |  _ <  __/\ V /  __/ |  \__ \  __/ | |_| | |\  |___) |
// |_| \_\___| \_/ \___|_|  |___/\___| |____/|_| \_|____/


//////////////////////////////////
// Return the module definition //
//////////////////////////////////
module.exports = dns;
