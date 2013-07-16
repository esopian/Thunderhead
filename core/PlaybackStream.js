var stream = require('stream');
var _      = require('underscore');
var http   = require('http');
var util   = require('util');

function PlaybackStream(options) {
    options = options || {};
    var self = this;
    self.options = options;

    self.rid = 0;
    if(options.debug) { 
        self.debug = true; 
        //Not a tru UUID but good enough for practical debugging
        self.rid = Math.floor((Math.random()*1000000000)+1);
    }

    //Pipes
    self.listeningPipes = [];

    //Recorded tape
    self.tape = [];
    self.recording = true;

    self.readable = true;
    self.writable = true;
    self.paused = false;
    self.busy = false;
    self.eof = false;

    self.log = function(info) {
        if(this.debug) {
            if(typeof info == "string") { info = this.rid+" : "+info; }
            console.log.call(this,info);
        }
    };

    self.on('pipe', function(inPipe){
        self.log('CAUGHT PIPE!');
        self.piped = true;
        if(!_.contains(self.listeningPipes, inPipe)) {
            self.log('Hooked Pipes!');
            self.listeningPipes.push(inPipe);
            ['write','data','error','drain','close','end'].forEach(function(name){
                inPipe.on(name, function(data){
                    self.tape.push({
                        name:name,
                        data:data
                    });
                    // if(!self.recording) { self.playback(); }
                });
            });

            // [].forEach(function(name){
            //     inPipe.on(name, function(data){
            //         self.log('UnHooked Pipes!');
            //         self.tape.push({
            //             name:name,
            //             data:data
            //         });
            //         var listener = _.indexOf(self.listeningPipes, inPipe);
            //         if (listener) { self.listeningPipes.splice(listener,1); }
            //         // if(!self.recording) { self.playback(); }
            //     });
            // });
        }
    });

    //Munch - Nom Nom Nom
    ['write','end','destory'].forEach(function(name){
        self[name] = function() {};
    });
    // 
    // ['write','data','error','drain','close','end'].forEach(function(name){
    //     self[name] = function(data) {
    //         self.tape.push({
    //             name:name,
    //             data:arguments
    //         });
    //     };
    // });

}

util.inherits(PlaybackStream, stream.Stream);

PlaybackStream.prototype.eraseTape = function(force) {
    if(!this.playing || force) { 
        this.log("Erasing Tape.");
        // this.tape = []; 
        // Clear Array but keep references
        this.tape.length = 0;
    } else {
        this.log("Tape Playing, can't erase");
    }
};

PlaybackStream.prototype.logTape = function() {
    this.log("PLAYBACK TAPE : "+this.rid);
    this.log(this.tape);
    this.log("*************");
};

PlaybackStream.prototype.pipe = function(dest) {
    //Remove Listener from a previous destination

    this.dest = dest;
    return stream.Stream.prototype.pipe.call(this,this.dest);
};

//Playback the history of the tape
PlaybackStream.prototype.playback = function(dest, options) {
    var self = this;
    options = options || {};
    
    if(dest) self.pipe(dest);

    self.log("PLAYBACK : "+self.rid);
    self.log("Destination : " + (this.dest!==undefined) );
    self.log("Recorded "+this.tape.length+" messages");
    var sentCount = 0;
    self.logTape();
    

    // if(!this.dest) { return false; }

    this.recording = false;
    this.playing = true;
    //self.logTape();
    (function tapeTick() {
        if(self.tape.length <= 0) { 
            self.log("Played "+sentCount+" messages");
            //Check if destination is another PlaybackStream
            if(options.cascade && self.dest && self.dest.playback) self.dest.playback();
            self.playing = false;
            self.recording = true;
            return true;
        } 

        var e = self.tape.shift();

        if(self.paused || self.busy) { return setTimeout(function(){ tapeTick(e); },0); }
        //Uncomment for method pattern
        // dest[e.method].apply(dest, e.args);
        sentCount++;
        if(e.data) { self.emit(e.name, e.data); }
        else { self.emit(e.name); }
        return setTimeout(function(){ tapeTick(); },0);
    })();

    return true;
};

module.exports = PlaybackStream;

