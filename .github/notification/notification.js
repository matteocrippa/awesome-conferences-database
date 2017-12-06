// libs
const OneSignal = require('node-onesignal').default;
const jsonfile = require('jsonfile');
const Twitter = require('twitter');

// setup twitter
const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// setup onesignal
const client = new OneSignal(process.env.ONESIGNAL_APPID, process.env.ONESIGNAL_KEY);

// file name
const lastFile = 'last.json';
const jsonFile = 'contents.json';

// get file content
const lastContent = jsonfile.readFileSync(lastFile);

// read json file
const json = jsonfile.readFileSync(jsonFile);

// last repo found
var lastConference = "";

// new conferences
var newConferences = [];

// loop
var startCounting = false;
json.conferences.forEach(function(item) {
    //console.log(item);
    if(startCounting == true) {
        lastConference = item.homepage;
        newConferences.push(item.title);
    }
    if(item.homepage == lastContent.last) {
        startCounting = true;
    }
});


//console.log(totalNew);

if(newConferences.length > 0) {
    var message = '';
    if(newConferences.length == 1) {
        message = '🎫 ' + newConferences.length + ' new mobile conference ('+ newConferences[0] +'), check it out!';
    } else {
        message = '🎫 ' + newConferences.length + ' new mobile conferences ('+ newConferences.join(", ") +'), check them out!';
    }
    // send push
    client.sendNotification(message, {
        included_segments: "Active Users"
    });

    // send twitter
    client.post('statuses/update', {status: message +' #awesomemobileconf'}, function(error, tweet, response) {
        if (!error) {
            console.log(tweet);
        } else {
            console.log(error);
        }
    });

    console.log('OneSignal Message sent: ' + message);
    // add last
    lastContent.last = lastConference;
    // write file
    jsonfile.writeFileSync(lastFile, lastContent);
}
