const request = require('request');
var deasync=require('deasync');
var schema = require('./schema.json');
var natural = require('natural');
var calc = require('./module.js');
require('dotenv').config()
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;
var servicenow = require('./servicenow.js');
var async = require('async');

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    var response = [];
    var flag = false;
    var result = [];
    var contextFlag = false;
    var reply;
    var resp ;
    var out;

if(schema.intentSchema[1].context) {
    schema.intentSchema.forEach(function(element, i) {
        element.utterances.forEach(function(element1, j) {
            //console.log("Score : "+natural.JaroWinklerDistance(message, element1));
            if (natural.JaroWinklerDistance(message, element1) >= 0.75) {
                response.push(element.responses[Math.floor(Math.random() * Math.floor(j))]);
                //console.log(element.context);
                if(i == 1) {
                    schema.intentSchema[1].context = false;
                }
            }
        });
    });
} else {

    let serviceNowResponse = deasync(function(callback){
        servicenow.logIncident(message, callback);
    })();
    //console.log("Service Now Response Obtained Outside Callback : "+serviceNowResponse.result.number)
    response.push(`Your incident has been created with the incident number ${serviceNowResponse.result.number}.`);
    schema.intentSchema[1].context = true;
}

    if (response.length != 0) {
        reply = response[Math.floor(Math.random())];
    } else {
        reply = "Sorry! I didn't get that.";
    }

    var out = request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            "message": {
                "text" : reply
            }
        }
    });
    out.on('error', function(err) {
            console.log("Timedout error");
    });
};
