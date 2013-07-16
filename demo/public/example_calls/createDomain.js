var thunderhead = require('../../../thunderhead');
var config = require('../config');

var client = new thunderhead({
    username : config.username,
    apikey : config.apiKey,
    region : config.region
});

client.dns.createDomain({
    name : 'example.com',
    emailAddress : "domains@example.com",
    ttl : 900,
    recordsList : {
        records : [
            {
                "ttl" : 900,
                "name" : 'example.com',
                "type" : "A",
                "data" : "10.10.10.10"
            },
            {
                "ttl" : 900,
                "name" : 'www.example.com',
                "type" : "CNAME",
                "data" : '91283yhasjdfh9812h34lasd.example.com'
            }
        ]
    }
}, function(err, reply) {
    if(err) { return console.err(err); }
    else {
        //Successfully created a domain
        return console.log(reply);
    }
});