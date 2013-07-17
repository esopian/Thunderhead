var express = require('express');
var thunderhead = require('../thunderhead');
var config = require('./public/config');

console.log(config);

var client = new thunderhead({
	// services : ['storage'],
	username : config.username || "<username>",
	apikey : config.apiKey || "<apikey>",
	region : 'ORD'
});

var port = config.port || 8080;

//   _____  ___ __  _ __ ___  ___ ___
//  / _ \ \/ / '_ \| '__/ _ \/ __/ __|
// |  __/>  <| |_) | | |  __/\__ \__ \
//  \___/_/\_\ .__/|_|  \___||___/___/
//
// Create Server Object
var app = express();

app.configure(function(){
	app.use(express.methodOverride());
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.errorHandler({ showStack: true, dumpExceptions: true}));
	//Static Routing
	app.use( express.static(__dirname + '/public') );
});

app.post('/command/:service/:command', function(req, res, next){
    if(!client[req.params.service] || typeof client[req.params.service][req.params.command] != 'function') {
        return res.json({Error: 'Could not find requested command'}, 400);
    }

	client[req.params.service][req.params.command](req.body, function(err, reply) {
		if(err) return res.json(err, 500);
		res.json(reply);
	});
});

console.log("Server Listening on port: "+port);
app.listen(port);
