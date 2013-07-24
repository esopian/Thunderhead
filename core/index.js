/**
 *
 */
var request = require('request');
var _ = require('underscore');
var url = require('url');
var PlaybackStream = require('./PlaybackStream');

var urlRegex = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

function core() {
    //Config Options
    this.asyncDecay = 100;
    this.maxFailures = 5;
    this.failCount = 0;

    return this;
}
core.prototype.constructor = core;

core.prototype.formatJSON = function(data) {
    var output = null;
    try {
        output = JSON.parse(data);
    } catch(e) {
        return data;
    }
    return output;
};

/**
 * [request description]
 * @param  {[type]}   options  [description]
 * @param  {Function} callback [description]
 * @return {[type]}
 */
core.prototype.request = function(options, callback, service) {
    var self = this;
    options = options || {};
    options.url = options.url || "";
    options.headers = options.headers || {};
    callback = callback || function(){}; // Prevent empty callback errors - allows stream only interfaces

    var returnStream = new PlaybackStream();
    var play_callback = function(err, reply, response) {
        //Keep failure count
        if(err) { self.failCount+=1; }
        else { self.failCount = ((self.failCount-=1)<0) ? 0 : self.failCount; }

        if(returnStream) returnStream.playback();
        callback(err, reply, response);
    };

    if((!this.identity.isAuthenticated()) && (!options.skipAuth) && (!options.attemptedAuth)) {
        options.attemptedAuth  = true;
        options.initialAuthRun = true;
        //Authenticate the sdk session
        this.identity.authenticate(null, function(err, reply) {
            if(!err) {
                returnStream.eraseTape();
                setTimeout(function(){
                    service.request(options, play_callback).pipe(returnStream);
                },0);
            } else {
                tokenError = true;
                play_callback(err,reply);
            }
        });
        // .pipe(returnStream);
    } else {
        //Required request parameters
        var pURL = url.parse(options.url);
        if (pURL['protocol']) {
            //Is an FQ Url
            options.url = encodeURI(options.url);
        } else {
            //fix leading slash
            if(options.url[0] != "/") { options.url = "/"+options.url; }
            var target = (service.endpoint || "")+options.url;
            options.url = encodeURI( (service.endpoint || "")+options.url);
        }

        var requestObj = {
            url : options.url,
            method : options.method || "GET",
            strictSSL : options.strictSSL || true,
            qs : options.qs || null
        };

        if(typeof options.data == "string") {
            //TODO: Probably want to do something else with this.
            requestObj.body = options.data;
        } else if (Buffer.isBuffer(options.data)) {
            requestObj.body = options.data;
        } else {
            requestObj.json = options.data;
        }

        //Load Auth Tokens
        if(self.identity.token) {
            requestObj.headers = _.extend({},{
                "X-Auth-Token" : self.identity.token.id,
                "Accept" : "application/json"
            }, options.headers);
        } else {
            requestObj.headers = options.headers;
        }


        request(requestObj, function(err, response, body) {
            if(err) {
                return play_callback(err);
            }
            //Process return
            if ((!options.skipAuth) && (!options.attemptedAuth) && response.statusCode == 401) {
                dataBuffer            = new Buffer(0);
                options.attemptedAuth = true;

                self.identity.authenticate(null, function(err, reply) {
                    if(!err) {
                        returnStream.eraseTape();
                        setTimeout(function(){
                            service.request(options, play_callback).pipe(returnStream);
                        },0);
                    } else {
                        tokenError = true;
                        play_callback(err,reply);
                    }
                });
                // .pipe(returnStream);
                return;
            }
            var httpError = self.processHTTPError(response.statusCode);
            if(httpError) {
                var retErr = {
                    error: httpError.error,
                    details : self.formatJSON(body)
                };
                tokenError = true;
                return play_callback(retErr);
            } else {
                //Callback after success
                var serviceRes = (self.formatJSON(body) || {});
                if(requestObj.method == "HEAD" || options.mergeHeaders ) {
                    var resHead = _.omit(response.headers, ['content-length', 'content-type', 'accept-ranges', 'date', 'connection']);

                    if(typeof serviceRes == 'object') {  _.extend(serviceRes,resHead); }
                    else { serviceRes = resHead; }
                }

                return play_callback(err, serviceRes, response);
            }
        }).pipe(returnStream);
    }

    return returnStream;
};

core.prototype.requestAsync = function(options, callback, service) {
    var self = this;
    callback = callback || function(){}; // Prevent empty callback errors - allows stream only interfaces
    var returnStream = new PlaybackStream(/*{debug:true}*/);
    var play_callback = function(err, reply, response) {
        //Keep failure count
        if(err) { self.failCount+=1; }
        else { self.failCount = ((self.failCount-=1)<0) ? 0 : self.failCount; }

        callback(err, reply, response);
        if(returnStream) returnStream.playbackOnEnd();
    };

    var decayTime = this.asyncDecay;
    (function statusLoop(wait, details){

        setTimeout(function(){
            returnStream.eraseTape();

            service.request(options, function(err, reply) {

                if(err) {
                    // if(rToken.piped)
                    return play_callback(err);
                }
                else {
                    //Check that reply is a job status
                    if(!reply.jobId) {
                        return play_callback(err,reply);
                    }
                    else {
                        if(reply.status == "COMPLETED") {
                            //TODO:  Prevent Loop calls.
                            if(reply.response || details) {
                                return play_callback(null, (reply.response || {message:"COMPLETED"}));
                            }
                            else {
                                //Get Details
                                options = { url : reply.callbackUrl+"?showDetails=true" };
                                statusLoop(0, true);
                            }
                        } else if (reply.status == "ERROR") {
                            if(reply.error || details) {
                                // if(rToken.piped)
                                return play_callback((reply.error || {error:"ERROR"}));
                            }
                            else {
                                //Get Details
                                options = { url : reply.callbackUrl+"?showDetails=true" };
                                statusLoop(0, true);
                            }
                        } else {
                            //Decay and run loop again
                            options = { url : reply.callbackUrl+"?showDetails=true" };
                            statusLoop(wait+decayTime);
                        }
                    }
                }
            }).pipe(returnStream);
        },wait);
    })(0);

    return returnStream;
};

core.prototype.requestBuilder = function(options, callback) {
    return this.core.request(options, callback, this);
};

core.prototype.requestAsyncBuilder = function(options, callback) {
    return this.core.requestAsync(options, callback, this);
};

core.prototype.processArgs = function(vOpts, args) {
    vOpts = _.extend({
        required : [],
        default : null
    }, vOpts);

    //check for function only
    if(typeof args[0] == 'function') {
        if(vOpts.required.length === 0) {
            args[1] = args[0];
            args[0] = {};
        } else {
            return false;
        }
    } else if(typeof args[0] != "object") {
        if(vOpts.default) {
            var tempObj = {};
            tempObj[vOpts.default] = args[0];
            args[0] = tempObj;
        } else {
            return false;
        }
    }

    //Check for a valid callback
    if(typeof args[1] == 'undefined') { 
        args[1] = function(){}; 
    } //Assume call is expecting a stream

    //Check for all required options
    var validReqs = true;
    _.each(vOpts.required, function(rOpt){
        if(args[0][rOpt] === undefined) { validReqs = false; }
    });
    if(!validReqs) { return false; }

    return true;
};

core.prototype.processHTTPError = function(statusCode) {
    switch (true) {
        case /400/.test(statusCode):
            return {error: "Bad Request"};
        case /401/.test(statusCode): //TODO: Perform a reauth
        case /403/.test(statusCode):
            return {error: "Unauthorized"};
        case /409/.test(statusCode):
            return {error: "Item Already Exists"};
        case /413/.test(statusCode):
            return {error: "Limit Exceeded"};
        case /404/.test(statusCode):
            return {error: "Item not Found"};
        case /408/.test(statusCode):
            return {error: "Request Timed Out"};
        case /5../.test(statusCode):
            return {error: "Server Response Error"};
        default:
            return false;
    }
};

core.prototype.getMime = function(filename) {

    //Put mime type definitions here.  If set in this list it will be submitted in the headers.  
    //  If omitted, rackspace will default to their mime settings or octet-stream
    var mimeList = {
        "323" : "text/h323",
        "*" : "application/octet-stream",
        "acx" : "application/internet-property-stream",
        "ai" : "application/postscript",
        "aif" : "audio/x-aiff",
        "aifc" : "audio/x-aiff",
        "aiff" : "audio/x-aiff",
        "asf" : "video/x-ms-asf",
        "asr" : "video/x-ms-asf",
        "asx" : "video/x-ms-asf",
        "au" : "audio/basic",
        "avi" : "video/x-msvideo",
        "axs" : "application/olescript",
        "bas" : "text/plain",
        "bcpio" : "application/x-bcpio",
        "bin" : "application/octet-stream",
        "bmp" : "image/bmp",
        "c" : "text/plain",
        "cat" : "application/vnd.ms-pkiseccat",
        "cdf" : "application/x-cdf",
        "cer" : "application/x-x509-ca-cert",
        "class" : "application/octet-stream",
        "clp" : "application/x-msclip",
        "cmx" : "image/x-cmx",
        "cod" : "image/cis-cod",
        "cpio" : "application/x-cpio",
        "crd" : "application/x-mscardfile",
        "crl" : "application/pkix-crl",
        "crt" : "application/x-x509-ca-cert",
        "csh" : "application/x-csh",
        "css" : "text/css",
        "dcr" : "application/x-director",
        "der" : "application/x-x509-ca-cert",
        "dir" : "application/x-director",
        "dll" : "application/x-msdownload",
        "dms" : "application/octet-stream",
        "doc" : "application/msword",
        "dot" : "application/msword",
        "dvi" : "application/x-dvi",
        "dxr" : "application/x-director",
        "eps" : "application/postscript",
        "etx" : "text/x-setext",
        "evy" : "application/envoy",
        "exe" : "application/octet-stream",
        "fif" : "application/fractals",
        "flr" : "x-world/x-vrml",
        "gif" : "image/gif",
        "gtar" : "application/x-gtar",
        "gz" : "application/x-gzip",
        "h" : "text/plain",
        "hdf" : "application/x-hdf",
        "hlp" : "application/winhlp",
        "hqx" : "application/mac-binhex40",
        "hta" : "application/hta",
        "htc" : "text/x-component",
        "htm" : "text/html",
        "html" : "text/html",
        "htt" : "text/webviewhtml",
        "ico" : "image/x-icon",
        "ief" : "image/ief",
        "iii" : "application/x-iphone",
        "ins" : "application/x-internet-signup",
        "isp" : "application/x-internet-signup",
        "jfif" : "image/pipeg",
        "jpe" : "image/jpeg",
        "jpeg" : "image/jpeg",
        "jpg" : "image/jpeg",
        "js" : "application/x-javascript",
        "latex" : "application/x-latex",
        "lha" : "application/octet-stream",
        "lsf" : "video/x-la-asf",
        "lsx" : "video/x-la-asf",
        "lzh" : "application/octet-stream",
        "m13" : "application/x-msmediaview",
        "m14" : "application/x-msmediaview",
        "m3u" : "audio/x-mpegurl",
        "man" : "application/x-troff-man",
        "mdb" : "application/x-msaccess",
        "me" : "application/x-troff-me",
        "mht" : "message/rfc822",
        "mhtml" : "message/rfc822",
        "mid" : "audio/mid",
        "mny" : "application/x-msmoney",
        "mov" : "video/quicktime",
        "movie" : "video/x-sgi-movie",
        "mp2" : "video/mpeg",
        "mp3" : "audio/mpeg",
        "mpa" : "video/mpeg",
        "mpe" : "video/mpeg",
        "mpeg" : "video/mpeg",
        "mpg" : "video/mpeg",
        "mpp" : "application/vnd.ms-project",
        "mpv2" : "video/mpeg",
        "ms" : "application/x-troff-ms",
        "msg" : "application/vnd.ms-outlook",
        "mvb" : "application/x-msmediaview",
        "nc" : "application/x-netcdf",
        "nws" : "message/rfc822",
        "oda" : "application/oda",
        "p10" : "application/pkcs10",
        "p12" : "application/x-pkcs12",
        "p7b" : "application/x-pkcs7-certificates",
        "p7c" : "application/x-pkcs7-mime",
        "p7m" : "application/x-pkcs7-mime",
        "p7r" : "application/x-pkcs7-certreqresp",
        "p7s" : "application/x-pkcs7-signature",
        "pbm" : "image/x-portable-bitmap",
        "pdf" : "application/pdf",
        "pfx" : "application/x-pkcs12",
        "pgm" : "image/x-portable-graymap",
        "pko" : "application/ynd.ms-pkipko",
        "pma" : "application/x-perfmon",
        "pmc" : "application/x-perfmon",
        "pml" : "application/x-perfmon",
        "pmr" : "application/x-perfmon",
        "pmw" : "application/x-perfmon",
        "pnm" : "image/x-portable-anymap",
        "pot" : "application/vnd.ms-powerpoint",
        "ppm" : "image/x-portable-pixmap",
        "pps" : "application/vnd.ms-powerpoint",
        "ppt" : "application/vnd.ms-powerpoint",
        "prf" : "application/pics-rules",
        "ps" : "application/postscript",
        "pub" : "application/x-mspublisher",
        "qt" : "video/quicktime",
        "ra" : "audio/x-pn-realaudio",
        "ram" : "audio/x-pn-realaudio",
        "ras" : "image/x-cmu-raster",
        "rgb" : "image/x-rgb",
        "rmi" : "audio/mid",
        "roff" : "application/x-troff",
        "rtf" : "application/rtf",
        "rtx" : "text/richtext",
        "scd" : "application/x-msschedule",
        "sct" : "text/scriptlet",
        "setpay" : "application/set-payment-initiation",
        "setreg" : "application/set-registration-initiation",
        "sh" : "application/x-sh",
        "shar" : "application/x-shar",
        "sit" : "application/x-stuffit",
        "snd" : "audio/basic",
        "spc" : "application/x-pkcs7-certificates",
        "spl" : "application/futuresplash",
        "src" : "application/x-wais-source",
        "sst" : "application/vnd.ms-pkicertstore",
        "stl" : "application/vnd.ms-pkistl",
        "stm" : "text/html",
        "sv4cpio" : "application/x-sv4cpio",
        "sv4crc" : "application/x-sv4crc",
        "svg" : "image/svg+xml",
        "swf" : "application/x-shockwave-flash",
        "t" : "application/x-troff",
        "tar" : "application/x-tar",
        "tcl" : "application/x-tcl",
        "tex" : "application/x-tex",
        "texi" : "application/x-texinfo",
        "texinfo" : "application/x-texinfo",
        "tgz" : "application/x-compressed",
        "tif" : "image/tiff",
        "tiff" : "image/tiff",
        "tr" : "application/x-troff",
        "trm" : "application/x-msterminal",
        "tsv" : "text/tab-separated-values",
        "txt" : "text/plain",
        "uls" : "text/iuls",
        "ustar" : "application/x-ustar",
        "vcf" : "text/x-vcard",
        "vrml" : "x-world/x-vrml",
        "wav" : "audio/x-wav",
        "wcm" : "application/vnd.ms-works",
        "wdb" : "application/vnd.ms-works",
        "woff": "application/font-woff",
        "wks" : "application/vnd.ms-works",
        "wmf" : "application/x-msmetafile",
        "wps" : "application/vnd.ms-works",
        "wri" : "application/x-mswrite",
        "wrl" : "x-world/x-vrml",
        "wrz" : "x-world/x-vrml",
        "xaf" : "x-world/x-vrml",
        "xbm" : "image/x-xbitmap",
        "xla" : "application/vnd.ms-excel",
        "xlc" : "application/vnd.ms-excel",
        "xlm" : "application/vnd.ms-excel",
        "xls" : "application/vnd.ms-excel",
        "xlt" : "application/vnd.ms-excel",
        "xlw" : "application/vnd.ms-excel",
        "xof" : "x-world/x-vrml",
        "xpm" : "image/x-xpixmap",
        "xwd" : "image/x-xwindowdump",
        "z" : "application/x-compress",
        "zip" : "application/zip"
    };

    var ext = /.+\.([^.]+)$/gm.exec(filename);
    if(ext) {
        ext = ext[1];
        return mimeList[ext] || false;
    } else {
        // return 'binary/octet-stream';
        return false;
    }
};

module.exports = core;
