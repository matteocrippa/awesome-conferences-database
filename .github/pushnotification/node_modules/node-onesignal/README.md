# OneSignal SDK for Node.js [![Build Status](https://travis-ci.org/scoutforpets/node-onesignal.svg?branch=master)](https://travis-ci.org/scoutforpets/node-onesignal)
This is an unofficial Node.js SDK for the [OneSignal Push Notification Service](https://onesignal.com/), which wraps their [REST API](https://documentation.onesignal.com/docs/server-api-overview).

## Basic Usage

```js
// require the module
const OneSignalClient = require('node-onesignal');

// create a new clinet
const client = new OneSignalClient([YOUR APP ID], [YOUR REST API KEY]);

// send a notification
client.sendNotification('test notification', {
    included_segments: 'all'
});
```

## API

`OneSignalClient(appId, restApiKey)`
* `appId`_(string, required)_ - your OneSignal App ID

* `restApiKey`_(string, required)_ - your OneSignal REST API Key

`sendNotification(message, options)`
* `message`_(string/object, required)_ - the content of your message. **Note:** when passing an object, please see the [OneSignal documentation](https://documentation.onesignal.com/docs/notifications-create-notification) for details on the format.

* `options`_(object)_ - OneSignal options. Please see the [OneSignal documentation](https://documentation.onesignal.com/docs/notifications-create-notification).

As you can see, this SDK does not implement all of the methods available through the OneSignal REST API. If there are other methods you require, please open an issue or feel free to create a PR (with tests!).

## Contributing
Just open a PR and include tests. Any help is greatly appreciated!
