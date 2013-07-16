/**
 * List all storage containers
 */

var thunderhead = require('../thunderhead');
var util = require('util');
var fs = require('fs');

var client = new thunderhead({
	// services : ['storage'],
	username : '(username)',
	apikey : '(apikey)'
});

// client.storage.deleteContainer("eamtest",function(err, reply){
// 	console.log(err);
// 	console.log(reply);
// });

var ws = fs.createWriteStream('testfile.txt');
// var token = client.dns.exportDomain("3556782").pipe(ws);
var token = client.dns.exportDomain("3556782");
token.on('data', function(chunk) {
		console.log("!!!DATA!!!");
		console.log(chunk);
	});
// token.on('end', function() {
// 		console.log("!!!END!!!");
// 		console.log(arguments);
// 	});
// token.on('error', function(err) {
// 		console.log("!!!ERROR!!!");
// 		console.log(err);
// 	});


// client.dns.listLimitTypes(function(err, reply){
// 	console.log(util.inspect(reply, true, null));
// 	client.dns.listLimits(function(err, reply){
// 		if(err) return console.log(err);
// 		console.log(util.inspect(reply, true, null));
// 	});
// });

// client.storage.listContainers(function(err, reply){
// 	console.log(err);
// 	console.log(reply);
// });

// client.storage.createContainer("eamTEST", function(err, reply){

// 	client.storage.editContainerMeta({
// 		container : "eamTEST",
// 		meta : {
// 			"X-Container-Meta-INFO": "TEST"
// 		}
// 	}, function(err, reply){

// 		client.storage.getContainerMeta("eamTEST",function(err,reply){
		
// 			client.storage.deleteContainer("eamTEST",function(err,reply){

// 				client.storage.listContainers(function(err, reply){
// 					console.log(err);
// 					console.log(reply);
// 				});
// 			});
// 		});
// 	});
// });


// var fs = require('fs');
// var fileBuffer = fs.readFileSync('/tmp/img4.jpg');
// client.storage.putObject({
// 	object : "imagefour.jpg",
// 	data : fileBuffer,
// 	container : 'cloudtest'
// }, function(err, reply, response){
// 	console.log(err);
// 	console.log(response);
// });

// client.storage.deleteObject("cloudtest/EAMFile.txt", function(err,reply){
// 	console.log(err);
// 	console.log(reply);
// });

// client.storage.editObjectMeta({
// 	container: "cloudtest",
// 	object: "img4.jpg",
// 	meta: {
// 		"X-Object-Meta-Fruit": "Apple",
// 		"X-Object-Meta-Veggie": "Carrot"
// 	}
// }, function(err, reply){
// 	if(err) return err;
// 	client.storage.getObjectMeta("cloudtest/img4.jpg", function(err,reply){
// 		console.log(err);
// 		console.log(reply);
// 	});
// });