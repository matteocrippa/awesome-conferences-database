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
const client = new OneSignalClient(process.env.ONESIGNAL_APPID, process.env.ONESIGNAL_KEY);

// read json file
const json = jsonfile.readFileSync(jsonFile);

// last repo found
var lastConference = "";

// loop
var startCounting = false;
var totalNew = 0;
json.conferences.forEach(function(item) {
  //console.log(item);
  if(startCounting == true) {
    totalNew++;
    lastConference = item.homepage;
  }
  if(item.homepage == lastContent.last) {
    startCounting = true;
  }
});



console.log(totalNew);

if(totalNew > 0) {
  const message = 'Hey, we have found ' + totalNew+ ' new mobile conference, check them out!';
  // send push
  client.sendNotification(message, {
      included_segments: 'all'
  });

  //console.log(message);
  // add last
  lastContent.last = lastConference;
  // write file
  jsonfile.writeFileSync(lastFile, lastContent);
}
