const request = require('request');
var schema = require('./schema.json');
var natural = require('natural');
var calc = require('./module.js');
const FACEBOOK_ACCESS_TOKEN = EAAc6hI7VvPwBANp3BZAgcztmOwZCUmHrhBvUi0EZAOn2Byhq6i2jjiqdIHUcNZBZADgj5HZAXpCzl962Nhi6ou23blwFOZCQosStTY3tGPZAzCxGkQAPgOdpjHSMxIqK5f2mUq8ovFZCveHwZAVbF6ZB4yqjlZCZCCpWvdnf0iTnbrUizmQZDZD;

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    var response = [];
    var flag = false;
    var result = [];

    schema.intentSchema.forEach(function(element, i) {
        element.utterances.forEach(function(element1, j) {
            //console.log("Score : "+natural.JaroWinklerDistance(message, element1));
            if (natural.JaroWinklerDistance(message, element1) >= 0.75) {
                response.push(element.responses[Math.floor(Math.random() * Math.floor(j))]);
            }
        });
    });

    if (response.length !=0) {
        reply = response[Math.floor(Math.random())];
        flag = true;
    } else  if (response.length == 0) {
        calc.regexCalc(message, function(res, type){
            response = res;
        });
    }

    if (response.length == 0) {
        reply = "Sorry! I didn't get that";
    } else if (!flag) {
        reply = response[0];
        //console.log(reply);
    }
    reply = response[0];
    
    // result.push({id: global.followUpSymptomId, choice_id: global.diagnosisSymptomStatus});

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
            console.log(err.message.code);
    });
};
