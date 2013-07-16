var thunderhead = require('../../../thunderhead');
var config = require('../config');

var client = new thunderhead({
    username : config.username,
    apikey : config.apiKey,
    region : config.region
});

var container = '<container_name>';

//Create an empty container in Cloud Files
client.storage.createContainer(container, function(err, reply) {
    //Check for errors returned from Rackspace
    if (err) return callback(err);

    //Set up a default error and index page for the container
    client.storage.editContainerMeta({
        container : container,
        meta      : {
            "X-Container-Meta-Web-Error" : "error.html",
            "X-Container-Meta-Web-Index" : "index.html"
        }
    }, function(err, reply) {
        //Check for errors returned from Rackspace
        if (err) return callback(err);

        //Enable the container for public browsing
        client.cdn.enableContainer(container, function(err, reply) {
            if (err) return callback(err);
            return callback(null, "DONE");
        });
    });
});