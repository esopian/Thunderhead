var thunderhead = require('../../../thunderhead');
var config = require('../config');

var client = new thunderhead({
    username : config.username,
    apikey : config.apiKey,
    region : config.region
});

client.storage.accountDetails(null, function(err, reply){
    if(err) return console.log(err);

    /*
    {
		"x-account-object-count": "73137",
		"x-timestamp": "1354554000.90864",
		"x-account-meta-temp-url-key": "de3casdfc3asdf35dasdfasdf2asdf7c",
		"x-account-bytes-used": "4545469877",
		"x-account-container-count": "1662",
		"x-trans-id": "tx2123rsdfca224ea2f2fasdf2asdfb85c5"
	}
    */

    //Log the account details
    console.log(reply);
});