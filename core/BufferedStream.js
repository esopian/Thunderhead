var stream = require('stream');
var _      = require('underscore');
var http   = require('http');
var util   = require('util');

var BufferedStream = function() {
    http.ServerResponse.apply(this,arguments);
};
util.inherits(BufferedStream, http.ServerResponse);


var BufferedStream = stream.Stream;
BufferedStream.prototype = _.extend({
  writable : true,
  readable : true,
  write : function (data) {
    this.emit('data',data);
    return true;
    // OR return false and emit('drain') when ready later
  },
  end : function (data) {
    if (data) this.emit('data', data);
    this.emit('end');
    this.ended = true;
  },
  error : function (data) {
    this.emit('error', data);
    this.ended = true;
  }
}, stream.Stream.prototype);


module.exports = BufferedStream;
