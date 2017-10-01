// libs
const OneSignal = require('node-onesignal').default;
const jsonfile = require('jsonfile');

// file name
const lastFile = 'last.json';
const jsonFile = 'contents.json';

// get file content
const lastContent = jsonfile.readFileSync(lastFile);

//console.log(lastContent);

// add env var to travisCI
const client = new OneSignal(process.env.ONESIGNAL_APPID, process.env.ONESIGNAL_KEY);

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
    message = totalNew + ' new mobile conference ('+ newConferences[0] +'), check it out!';
  } else {
    message = totalNew + ' new mobile conferences ('+ newConferences.join(", ") +'), check them out!';
  }
  // send push
  client.sendNotification(message, {
    included_segments: "Active Users"
  });

  console.log('OneSignal Message sent: ' + message);
  // add last
  lastContent.last = lastConference;
  // write file
  jsonfile.writeFileSync(lastFile, lastContent);
}
