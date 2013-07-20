/**
 * Exports convenience methods to be appended into the core class
 * @type {Object} Definition of prototype methods
 */
module.exports = {

	enableLog : function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.editContainerMeta({
			container: options.container,
			meta: {
				'X-Log-Retention' : 'True'
			}
		}, callback);
	},

	disableLog : function(options, callback) {
		if(!this.core.processArgs({
			required : ['container'],
			default : 'container'
		}, arguments)) { return callback({error:"Bad Arguments"}); }

		return this.editContainerMeta({
			container: options.container,
			meta: {
				'X-Log-Retention' : 'False'
			}
		}, callback);
	}
};
