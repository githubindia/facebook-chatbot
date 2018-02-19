const request = require('request');
var schema = require('./schema.json');
var natural = require('natural');

const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_TOKEN;

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    var response = [];
    
    schema.intentSchema.forEach(function(element, i) {
        element.utterances.forEach(function(element1, j){
            if (natural.JaroWinklerDistance(message, element1) >= 0.85) {
                response.push(element.responses[Math.floor(Math.random() * Math.floor(j))]);
            } else {
                response.push("Sorry! I didn't get that");
            }
        })
    })

    var reply = response[Math.floor(Math.random())];
    console.log(reply);

    request({
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
};