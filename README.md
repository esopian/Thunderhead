# [Thunderhead](http://www.thunderheadjs.com)

Highly usable [Node.js](nodejs.org) SDK for accessing the [Rackspace Open Cloud](http://www.rackspace.com/cloud/) API


## About

hmmm


## Getting Started

hmmm


## Installation

    npm install thunderhead


## Usage

Methods are called using Node.js' function(options, callback) convention.  If ther is only one required argument you can pass it instead of the options object.

Below is an example call logging all empty Rackspace Cloud Files containers

    var thunderhead = new require('thunderhead')({
        username : 'RackspaceUsername',
        apikey   : 'RackspaceKey',
        region   : 'ORD'
    });

    thunderhead.storage.listContainers(null, function(err, reply){
        if(err) return console.log(err);

        reply.forEach(function(container){
	        console.log(container);
            if(container.count === 0) return console.log(container + "is empty");
        });
    });

You can also pipe the results through a stream if desired.  The below code streams a file from a container to the filesystem.

    var thunderhead = new require('thunderhead')({
        username : 'RackspaceUsername',
        apikey   : 'RackspaceKey',
        region   : 'ORD'
    });
    var writeStream = fs.createWriteStream('DestinationPath');
    writeStream.on('end',   function()    { console.log('Done'); });
    writeStream.on('error', function(err) { console.log("file stream error", err); });

    thunderhead.storage.getObject({
        container : 'containerName',
        object    : 'objectName'
    }).pipe(writeStream);


## Documentation and Examples

There is an included [Express](expressjs.com) application which is provided as a documentation source for the different Thunderhead methods and allows for executing test calls.  It can be started as follows.

    cp demo/public/config.example.js demo/public/config.js
    # update demo/public/config.js with your Rackspace api values
    cd demo
    node ./server.js

The demo server will now be running at <http://localhost:8080>


## Testing

Tests are run using [Mocha](http://visionmedia.github.io/mocha/) and [should](https://github.com/visionmedia/should.js/).

    npm install -g mocha
    npm install -g should
    cp test/apiConfig.example.js test/apiConfig.js
    # update test/apiConfig.js with your Rackspace api values
    mocha


## Todo

* complete API coverage
* complete test coverage
* complete method documentation coverage


Copyright © 2013 [Cogsy](http://www.cogsy.com) licensed under the [MIT License](http://www.cogsy.com/mit_license)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/cogsy/Thunderhead/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
