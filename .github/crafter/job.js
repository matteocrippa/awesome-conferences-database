// libs
const OneSignal = require('node-onesignal').default;
const {flag, code, name} = require('country-emoji');
const jsonfile = require('jsonfile');
const Twitter = require('twitter');

// setup twitter
const clientTwitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// setup onesignal
const client = new OneSignal(process.env.ONESIGNAL_APPID, process.env.ONESIGNAL_KEY);

// file name
const lastFile = 'last.json';
const submissionFile = 'submission.json';
const jsonFile = 'contents.json';

// get file content
const lastContent = jsonfile.readFileSync(lastFile);

// read json file
const json = jsonfile.readFileSync(submissionFile);

// last repo found
var lastConference = "";

// new conferences
var newConferences = [];

// loop
var startCounting = false;
json.conferences.forEach(function(item) {

    // convert flags
    item.emojiflag = flag(item.country);

    if(item.country === 'Vietnam') {
      item.emojiflag = '🇻🇳';
    }

    //console.log(item);
    if(startCounting === true) {
        lastConference = item.homepage;
        newConferences.push(item);
        // set this conference as new
        item.isnew = true;

    } else {
        // set all the other conf as old
        item.isnew = false;
    }

    if(item.homepage === lastContent.last) {
        startCounting = true;
    }
});


//console.log(totalNew);

if(newConferences.length > 0) {
    var message = '';

    if(newConferences.length === 1) {
        message = '🎫 ' + newConferences.length + ' new mobile conference ('+ newConferences[0].title +'), check it out!';
    } else {
        const confNames = newConferences.reduce(function(last, conference) {
            return last+", "+conference.title;
        });
        message = '🎫 ' + newConferences.length + ' new mobile conferences ('+ confNames +'), check them out!';
    }

    // send push
    client.sendNotification(message, {
        included_segments: "Active Users"
    });


    newConferences.forEach(function(conf) {
        // prepare message
        const twitterMessage =  conf.flag+' ' + conf.title + ' ( '+ conf.twitter +' ) will be between '+ conf.start +' and '+ conf.end +' in '+ conf.city +' 🎫 #awesomemobileconference';
        // send twitter
        clientTwitter.post('statuses/update', {status: twitterMessage }, function(error, tweet, response) {
            if (!error) {
                console.log(tweet);
            } else {
                console.log(error);
            }
        });
    });

    console.log('OneSignal Message sent: ' + message);

    // add last
    lastContent.last = lastConference;
    // write file
    jsonfile.writeFileSync(lastFile, lastContent, {spaces: 2, EOL: '\r\n'});
}

// save json
jsonfile.writeFileSync(jsonFile, json, {spaces: 2, EOL: '\r\n'});
