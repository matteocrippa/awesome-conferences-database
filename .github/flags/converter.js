const {flag, code, name} = require('country-emoji');

const jsonfile = require('jsonfile');

// file name
const contentFile = 'contents.json';

const json = jsonfile.readFileSync(contentFile);

// loop conferences
json.conferences.forEach(function(item) {
  item.emojiflag = flag(item.country);
});


