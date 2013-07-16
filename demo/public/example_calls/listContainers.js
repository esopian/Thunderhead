var thunderhead = require('../../../thunderhead');
var config = require('../config');

var client = new thunderhead({
    username : config.username,
    apikey : config.apiKey,
    region : config.region
});

client.storage.listContainers(function(err, reply){
    if(err) return console.log(err);

    //Find all containers with 0 items
    reply.forEach(function(container){
        if(container.count === 0) console.log(container);
    });
});