var thunderhead = require('../../../thunderhead');
var config = require('../config');

var client = new thunderhead({
    username : config.username,
    apikey : config.apiKey,
    region : config.region
});

client.storage.getContainerMeta({ 
    container: "<container_name>" 
}, function(err, reply){
    if(err) return console.err(err);

    //Show the container Meta Data
    console.dir(reply);
});