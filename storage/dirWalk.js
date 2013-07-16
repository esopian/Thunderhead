var fs = require('fs');

var pWalk = null;
var sWalk = null;

module.exports.parallel = pWalk = function(dir, callback) {
    //Final Results Array
    var results = [];

    //Start reading directory
    fs.readdir(dir, function(err, list) {
        //ERROR
        if (err) return callback(err);

        var pending = list.length;
        //Empty Directory
        if (!pending) return callback(null, results);
        
        list.forEach(function(file) {
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    //Directory Dive
                    pWalk(file, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) callback(null, results);
                    });
                } else {
                    //Push File
                    results.push(file);
                    if (!--pending) callback(null, results);
                }
            });
        });
    });
};