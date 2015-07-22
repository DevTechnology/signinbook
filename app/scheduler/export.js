var schedule = require('node-schedule');
var Entry = require('../models/entry');
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSON;
var fs = require('fs');
var json2csv = require('json2csv');
var config = require('../../config/config'); 
var AWS = require('aws-sdk');

AWS.config.region = config.aws_config_region;

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 5)];
rule.hour = 23;
rule.minute = 59;

var j = schedule.scheduleJob(rule, function() {
    if(config.auto_signout_all_at_midnight) {
        signoutAllForToday(function(err) {
            if(err)
                console.log("error when the setting timeout for all record is attempted.");
            getDailyReport();
        });
    } else {
        getDailyReport();
    }
});

//Test
//signoutAllForToday(function(err) {
//    if(err)
//        console.log("error when the setting timeout for all record is attempted.");
//    getDailyReport();
//});

function signoutAllForToday(callback) {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    
    Entry.find({ date : { $gt : new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
            $lt : new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()) },
          timeOut : {$exists : false} }).exec( function(err, entry) {
        console.log(entry);
    });
    
    Entry.update(
        { date : { $gt : new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
            $lt : new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()) },
          timeOut : {$exists : false} }, 
        { $set: 
            {
                timeOut : today
            }
        }, 
        {upsert: false, multi: true},
        function (err, entry) {
            console.log(entry);
            return callback(err);
        });
}

function getDailyReport() {
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    
    Entry.find({ date : { $gt : new Date(today.getFullYear(), today.getMonth(), today.getDate()), 
                           $lt : new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()) } })
         .sort('-date').exec(function(err, entries) {
        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            console.log("error when the export is attempted.");
        } else {
            var flattenedData = [];
            
            for(var i=0; i<entries.length; i++) {
                var objToAdd = entries[i];
                var obj = {};
                obj.fname = objToAdd.fname;
                obj.lname = objToAdd.lname;
                obj.company = objToAdd.company;
                obj.poc = objToAdd.poc;
                obj.date = objToAdd.date.toISOString().substring(0,10);
                obj.timeIn = objToAdd.timeIn;
                obj.timeOut = objToAdd.timeOut;
                obj.purpose = objToAdd.purpose;
                flattenedData.push(obj);
            }
            
            var fields = ['fname', 'lname', 'company', 'poc', 'date', 'timeIn', 'timeOut', 'purpose'];
            json2csv({ data: flattenedData, fields: fields }, function(err, csv) {
                if (err) console.log(err);
                var tmpFilename = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDate() + '/signin_logbook.csv';
                var s3bucket = new AWS.S3({params: {Bucket: config.aws_s3_bucket_name, Key: tmpFilename}});
                
                s3bucket.upload({Body: csv}, function(err) {
                    if(err) 
                        console.log(err);
                    console.log("Successfully uploaded data to " + config.aws_s3_bucket_name + "/" + tmpFilename);
                });
                
//                == Save the export to file ==               
//                fs.writeFile(tmpFilename, csv, function(err) {
//                    if (err) throw err;
//                });
            });
        }
    });
};