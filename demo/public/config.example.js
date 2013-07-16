if (typeof exports === 'object' && typeof define !== 'function') {
    define = function (factory) {
        factory(require, exports, module);
    };
}

define(function (require, exports, module) {

    module.exports = exports = {
        username    : 'username',
        apiKey      : 'apikey1234apikey1234',
        region      : "ORD",
        internalNet : false
    };

    return module.exports;
});