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

var dateRegex = RegExp(/^(0[1-9]|[12][0-9]|3[01]|[0-9])[- /.](0[1-9]|1[012]|[1-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/); // dd/MM/yyyy
var dateRegex2 = RegExp(/^(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[0-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/) // mm/dd/yyyy
var dateRegex3 = RegExp(/^(((19|20)\d\d)|[1-2][0-9])([- /.])(0[1-9]|1[012]|[1-9])[- /.](0[1-9]|[12][0-9]|3[01]|[0-9])$/); // yyyy/MM/dd
var dateRegex4 = RegExp(/^(0[1-9]|1[012]|[1-9])[- /.](((19|20)\d\d)|[1-2][0-9])$/);
var dateRegex5 = RegExp(/^(((19|20)\d\d)|[1-2][0-9])/);

// var str = "I want take a flight from 1st december this year to 12th jan 2018 12/2018 3rd quarter of 2015";
//var str = "I want to  book a flight 3rd quarter of 2012";

// var tokenizer = new natural.TreebankWordTokenizer();
// var arr = tokenizer.tokenize(str);

module.exports.regexCalc =  function (str, callback) {
    var tokenizer = new natural.TreebankWordTokenizer();
    var arr = tokenizer.tokenize(str);


    arr.forEach(function(element, i) {
        while (numRegex.test(element)) {
            var index = i + 1;
            if(monthShortRegex.test(arr[index])) {
                callback(element +" "+ arr[index], "Date");
            }
            if(monthLongRegex.test(arr[index])) {
                //console.log(element + " " + arr[index]);
                callback(element + " " + arr[index], "Date");
            }
        break;
        }
    });

    arr.forEach(function(element, i) {
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
    });
    function dates(key, name) {
        var dayOfWeek;
        var date = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        days.forEach(function(element, i){
            if (name == element.toLowerCase()) {
                dayOfWeek = i;
                var newDate = date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
                var newFormat = new Date(newDate);
                var dt = moment(newDate).format('LL');
                callback(dt, "Date")
            }
        })
        if (key == 'next' && name == 'month') {
            var date = moment(date).add(1, 'month').format('LL');
            callback(date, "Date");
        }
        if (key == 'this' && (name == 'month' || name == 'week' || name == 'year')) {
            callback("Please specify the date", "Date is not given");
        } else if (key =="next" && name == 'year') {
            var date = moment(date).add(1, 'year').format('LL');
            callback(date, "Date");
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
                        var date = moment(newDate).format('LL');
                        callback(date, "Date");
                        index = i;
                    }
                })
                if (index == undefined) {
                    var date = new Date();
                    var newDate = new Date (date.getFullYear() + ", 12, 31");
                    var dt = moment(newDate).format('LL');
                    callback(dt, "Date");
                }
            }
        }
    }
    arr.forEach(function(element, i) {
        if (numRegex.test(element)) {
            callback(element, "Integer");
        }
        if (floatRegex.test(element)) {
            callback(element, "Floating point number");
        }
    });

    arr.forEach(function(element){
        if (dateRegex.test(element) || dateRegex2.test(element) || dateRegex3.test(element) || dateRegex4.test(element) || dateRegex5.test(element)) {
            callback(element, "Date");
        }
    });

    function calculateQuarter(year1, quarter, addMonth, addYear, addDay) {
        var date = new Date();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        
        if(year1 != null) {
            if (quarter == 2 || quarter == 3) {
                var newDate = new Date(year1, (3 * quarter) - 1, + "30");
                var dt = moment(newDate).format('LL');
                callback(dt, "Date");
            } else {
                var newDate = new Date(year1, (3 * quarter) - 1, + "31");
                var dt = moment(newDate).format('LL');
                callback(dt, "Date");
            }
        } else {
            if (Math.ceil(month / 3) == 1) {
            var date = new Date(year + "," + (3 + addMonth) + ","+ (31 - addDay));
            var dt = moment(date).format('LL');
            callback(dt, "Date");
            }
            if (Math.ceil(month / 3) ==2) {
                var date = new Date(year + "," + (6 + addMonth) + ", 30");
                var dt = moment(date).format('LL');
                callback(dt, "Date");
            }
            if (Math.ceil(month / 3) ==3) {
                var date = new Date(year + "," + (9 + addMonth) + "," + (30 + addDay));
                var dt = moment(date).format('LL');
                callback(dt, "Date");
            }
            if (Math.ceil(month / 3) ==4) {
                var date = new Date((year + addYear) + "," + (12 + addMonth) + ", 31");
                var dt = moment(date).format('LL');
                callback(dt, "Date");  
            }
        }
    }
}