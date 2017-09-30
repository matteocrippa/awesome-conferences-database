import Joi from 'joi';
import Request from 'superagent';


// OneSignal v1 API url
const API_URL = 'https://onesignal.com/api/v1';


// The OneSignal Client
export default class Client {

    /**
     * Creates a new OneSignal client
     * @param  {string} appId      the appId for your app
     * @param  {string} restApiKey the REST API key for your app
     * @return {object} an initialized client
     */
    constructor(appId, restApiKey) {

        Joi.assert(appId, Joi.string().guid().required(), new Error('`appId` is required'));
        Joi.assert(restApiKey, Joi.string().required(), new Error('`restApiKey` is required'));

        this.appId = appId;
        this.restApiKey = restApiKey;
    }

    /**
     * Sends a notification.
     * @param  {string|object} message the message to display to the recipient
     * @param  {object} options a hash of options to pass to the API
     * @return {object} the response
     */
    async sendNotification(message, options) {

        options = options || {};

        // Perform some basic validation
        Joi.assert(message, Joi.alternatives().try(Joi.string(), Joi.object()).required(), new Error('`message` is required'));
        Joi.assert(options, Joi.object());

        // Convert message to object as required by the API
        if (typeof message === 'string') {
            message = {
                en: message
            }
        }

        // Craft the payload
        const payload = Object.assign({
            app_id: this.appId,
            contents: message
        }, options);

        // Make the request
        try {

            return await Request
                    .post(`${API_URL}/notifications`)
                    .set('Authorization', `Basic ${this.restApiKey}`)
                    .send(payload);
        }
        catch(err) {

            throw new Error(err.response.error.text);
        }
    }
};
