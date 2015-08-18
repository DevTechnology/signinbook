var Entry = require('./models/entry');
var ObjectID = require('mongodb').ObjectID;
var BSON = require('mongodb').BSON;
var fs = require('fs');
var async = require('async');
var ipaddr = require('ipaddr.js');
var appRoot = process.cwd();

function getEntries(req, res){
    var clientIpStr = "" + ipaddr.process(req.ip);
    var rangeIpArr = clientIpStr.split(".");
    var rangeStr = '^' + rangeIpArr[0] + "\\." + rangeIpArr[1] + "\\." + rangeIpArr[2] + '.*';
    
    Entry.find({ip: new RegExp(rangeStr),
                timeOut : {$exists : false} }).sort('-date').exec(function(err, entries) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(entries); // return all entries in JSON format
	});
};

function getDevTechies(res){
    
    fs.readFile(appRoot + '/config/devTechies', 'utf8', function (err, data) {
        console.log(data);
        if (err) {
            res.send(err)
        }
        res.json(data);
    });
};

function getPovs(res){
    fs.readFile(appRoot + '/config/purposeOfVisit', 'utf8', function (err, data) {
        console.log(data);
        if (err) {
            res.send(err)
        }
        res.json(data);
    });
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all entries
	app.get('/api/entries', function(req, res) {
		// use mongoose to get all entries in the database
		getEntries(req, res);
	});
	
	app.get('/api/devTechies', function(req, res) {
        // use mongoose to get all entries in the database
	    getDevTechies(res);
    });
	
	app.get('/api/povs', function(req, res) {
        // use mongoose to get all entries in the database
        getPovs(res);
    });

	// create entries and send back all entries after creation
	app.post('/api/entries', function(req, res) {
		// create a entry, information comes from AJAX request from Angular
		Entry.create({
			fname : req.body.fname,
			lname : req.body.lname,
			company : req.body.company,
			poc : req.body.poc,
			date : req.body.date,
			timeIn : req.body.timeIn,
			timeOut : req.body.timeOut,
			purpose : req.body.purpose,
			ip: ipaddr.process(req.ip),
			done : false
		}, function(err, entry) {
			if (err)
				res.send(err);
			// get and return all the entries after you create another
			getEntries(req, res);
		});
	});
	
	// update entries and send back all entries after creation
    app.put('/api/entries', function(req, res) {
        console.log(req.body);
        console.log(ObjectID(req.body._id));
        Entry.update(
            { _id: ObjectID(req.body._id) }, 
            { $set: 
                {
                    timeOut : req.body.timeOut
                }
            }, 
            {upsert: false},
            function (err, entry) {
                if (err)
                    res.send(err);
                getEntries(req, res);
            });
    });

	// delete a entries
	app.delete('/api/entries/:entries_id', function(req, res) {
		Entry.remove({
			_id : req.params.entry_id
		}, function(err, entries) {
			if (err)
				res.send(err);
			getEntries(req, res);
		});
	});

	// application -------------------------------------------------------------
	// The following is for dev test
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};