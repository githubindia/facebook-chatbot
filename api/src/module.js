var natural = require('natural');
var moment = require('moment');

//var regexDate = RegExp(/((\d+$)|([1](st)|[2](nd)|[3](rd)|[4-9](th)|[0-9]{2}(th))) \b(jan|feb|march|april|may|june|july|august|sept|oct|nov|dec)\b/);
var monthShortRegex = RegExp(/\b(jan|feb|march|april|may|june|july|aug|sept|oct|nov|dec)\b/);
var monthLongRegex = RegExp(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/);
var regex = RegExp(/\d? \b(seconds|minute|hour|hours|day|days|month|months|year|years|week|weeks)\b/);
var keyRegex = RegExp(/\b(this|next|last)\b/);
var afterKeyRegex = RegExp(/\b(week|month|year|monday|tuesday|wednesday|thursday|friday|saturday|sunday|quarter)\b/);
var floatRegex = RegExp(/^([0-9])[.]([0-9])/);
var numRegex = RegExp(/^(\d+$)|([1](st)|[2](nd)|[3](rd)|[4-9](th)|[0-9]{2}(th))/);
// var dateRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01]|[0-9])[- /.](0[1-9]|1[012]|[1-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/);
var dateRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01]|[0-9])[- /.](0[1-9]|1[012]|[1-9])[- /.](((20)[1-2][0-9])|[1-2][0-9])$/); // dd/MM/yyyy
var dateRegex2 = RegExp(/^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[0-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/) // mm/dd/yyyy
var dateRegex3 = RegExp(/^(((19|20)\d\d)|[1-2][0-9])([- /.])(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[0-9])$/); // yyyy/MM/dd
//var dateRegex4 = RegExp(/^(0[1-9]|1[012]|[1-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/);
var dateRegex5 = RegExp(/^(((19|20)\d\d)|[1-2][0-9])/);

var emailRegex = RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/);
var timeRegex = RegExp(/([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/);
var timeRegex2 = RegExp(/(AM|PM|am|pm)/);

var phoneRegex = RegExp(/^(?:(?:\+?([9][1]|[1])*(?:[.-]\s*)?)?(?:\(\s*([7-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/)

var pincodeRegex = RegExp(/^[1-9][0-9]{5}$/);
var streetAddress = RegExp(/^\d+\s[A-z]+\s[A-z]+/);

// var str = "I want take a flight from 1st december this year to 12th jan 2018 12/2018 3rd quarter of 2015";
//var str = "I want to  book a flight 3rd quarter of 2012";

module.exports.regexCalc =  function (str, callback) {
    var tokenizer = new natural.TreebankWordTokenizer();
    var arr = tokenizer.tokenize(str);
    var token = new natural.RegexpTokenizer({pattern: /\ /});
    var array = token.tokenize(str);
    var response = [];
    var reply;
    var flag = false;
    var intValue = [];
    var float = [];
    var dateArray = [];
    var duration = [];
    var email = [];
    var time = [];
    var phone = [];
    var pincode =[];
    var result=[];

    var flag = false;
    var dateArray1 = [];

//-------------------------------------------------------DATE CALCULATION LIKE "12th Jan"---------------------------//

    arr.forEach(function(element, i) {
        while (numRegex.test(element)) {
            var index = i + 1;
            var date = new Date();
            var year = date.getFullYear();
            element = element.replace(/(\d+)(st|nd|rd|th)/, "$1");
            if(monthShortRegex.test(arr[index])) {
                var str = arr[index] + " " + element + "," + year;
                var newDate = new Date(Date.parse(str));
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            }
            if(monthLongRegex.test(arr[index])) {
                var str = arr[index] + " " + element + "," + year;
                var newDate = new Date(Date.parse(str));
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            }
        break;
        }

//-------------------------------------------------------------------------------------------------------------//

        while(keyRegex.test(element)) {
            var index = i + 1;
            if(afterKeyRegex.test(arr[index])) {
                dates(arr[i], arr[index]);
            }
        break;
        }
        if (dateRegex5.test(element)) {
            arr.forEach(function(element1, i) {
                while (numRegex.test(element1)) {
                    var index = i + 1;
                    if(afterKeyRegex.test(arr[index])) {
                        calculateQuarter(element, element1.charAt(0), null, null, null);
                    }
                break;
                }
            })
        }

    function dates(key, name) {
        var dayOfWeek;
        var date = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(function(element, i){
            if (name == element.toLowerCase()) {
                dayOfWeek = i;
                var newDate = date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
                var newFormat = new Date(newDate);
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            }
        })
        if (key == 'next' && name == 'month') {
            var date = moment(date).add(1, 'month').format('L');
            dateArray.push(date);
        }
        if (key == 'this' && (name == 'month' || name == 'week' || name == 'year')) {
            callback("Please specify the date", "Date is not given");
        } else if (key =="next" && name == 'year') {
            var date = moment(date).add(1, 'year').format('L');
            dateArray.push(date)
        }
        if(name == 'quarter') {
            if (key == 'this') {
                calculateQuarter(null, null, 0, 0, 0);
            }
            if (key == 'next') {
                calculateQuarter(null, null, 3, 1, 1);
            }
            if (key == 'last') {
                var year;
                var index;
                arr.forEach(function(element, i) {
                    if (dateRegex5.test(element)) {
                        var newDate = new Date(element + ", 12, 31");
                        var dt = moment(newDate).format('L');
                        dateArray.push(dt);
                        index = i;
                    }
                });
                if (index == undefined) {
                    var date = new Date();
                    var newDate = new Date (date.getFullYear() + ", 12, 31");
                    var dt = moment(newDate).format('L');
                    dateArray.push(dt);
                }
            }
        }
    }
    //var integer_struct;

        if (numRegex.test(element)) {
            intValue.push(element);
        }
        if (floatRegex.test(element)) {
            float.push(element);
        }


        if (dateRegex.test(element) || dateRegex2.test(element) || dateRegex3.test(element)) {
            var date = new Date(element);
            var newDate = moment(date).format('L');
            dateArray.push(newDate);
        }
//-----------------------------------------------QUARTER CALCULATION-------------------------------------------//

    function calculateQuarter(year1, quarter, addMonth, addYear, addDay) {
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if(year1 != null) {
            if (quarter == 2 || quarter == 3) {
                var newDate = new Date(year1, (3 * quarter) - 1, + "30");
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            } else {
                var newDate = new Date(year1, (3 * quarter) - 1, + "31");
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            }
        } else {
            if (Math.ceil(month / 3) == 1) {
            var date = new Date(year + "," + (3 + addMonth) + ","+ (31 - addDay));
            var dt = moment(date).format('L');
            dateArray.push(dt);
            }
            if (Math.ceil(month / 3) == 2) {
                var date = new Date(year + "," + (6 + addMonth) + ", 30");
                var dt = moment(date).format('L');
                dateArray.push(dt);
            }
            if (Math.ceil(month / 3) == 3) {
                var date = new Date(year + "," + (9 + addMonth) + "," + (30 + addDay));
                var dt = moment(date).format('L');
                dateArray.push(dt);
            }
            if (Math.ceil(month / 3) == 4) {
                var date = new Date((year + addYear) + "," + (12 + addMonth) + ", 31");
                var dt = moment(date).format('L');
                dateArray.push(dt);
            }
        }
    }

//-------------------------------------------------------------------------------------------------------------//

//--------------------------------------------DURATION CALCULATION---------------------------------------------//
var dd = [];
        while (numRegex.test(element)) {
            
            var index = i + 1;
            var date = new Date();
            var year = date.getFullYear();
   
            element = element.replace(/(\d+)(st|nd|rd|th)/, "$1");
            if(monthShortRegex.test(arr[index])) {
                var str = arr[index] + " " + element + "," + year;
                var newDate = new Date(Date.parse(str));
                var dt = moment(newDate).format('L');
                console.log(dt);
                dateArray1.push(dt);
                dateArray.push(dt)
                // callback(dt, "Date");
                //dd.push(element + " " +arr[index]);
                if(arr[i-1] == 'from' && arr[i+2] == 'to') {
                    flag = true;
                }                
            }
            if(monthLongRegex.test(arr[index])) {
                var str = arr[index] + " " + element + "," + year;
                var newDate = new Date(Date.parse(str));
                var dt = moment(newDate).format('L');
                dateArray.push(dt);
            }
        break;
        }
//-------------------------------------------------------------------------------------------------------------//
//---------------------------------------TIME VALIDATION-------------------------------------------------------//
    while(numRegex.test(element)) {
        var index = i + 1;
        if(timeRegex2.test(arr[index])) {
            time.push(element + " " + arr[index]);
        }
        break;
    }
    while (numRegex.test(element)) {
        var index = i + 1;
        if (arr[index] == ':') {
            if (numRegex.test(arr[i+2])){
                time.push(element+":"+arr[i+2]);
            }
        }
    break;
    }
//-------------------------------------------------------------------------------------------------------------//

    while(phoneRegex.test(element)) {
        phone.push(element);
        break;
    } //Phone validation

    if(pincodeRegex.test(element)) {
        pincode.push(element);
    } //Pincode validation

});

array.forEach(function(element) {
    while(emailRegex.test(element)) {
        //emailArray.push(element);
        // callback(element, "email");
        email.push(element);
        break;
    }
}); //Email

if (flag) {
        var date1 = new Date(dateArray1[0]);
        var date2 = new Date(dateArray1[1]);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        duration.push(diffDays + 1);
    } //Duration calculation

var uniqueDate = dateArray.filter((v, i, a) => a.indexOf(v) === i); // removing duplicate dates from date array
  var payload = {
        "sessionId": "",
        "query": str,
        "parameters": {
            "date": uniqueDate,
            "integer": intValue,
            "email": email,
            "duration": duration,
            "time": time,
            "phone": phone,
            "pincode": pincode
        }
    }
callback(payload, "payload");
}
//-------------------------------------------------------------------------------------------------------------//

