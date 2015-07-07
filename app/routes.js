var Entry = require('./models/entry');

function getEntries(res){
	Entry.find(function(err, entries) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(entries); // return all entries in JSON format
		});
};

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all entries
	app.get('/api/entries', function(req, res) {

		// use mongoose to get all entries in the database
		getEntries(res);
	});

	// create entries and send back all entries after creation
	app.post('/api/entries', function(req, res) {

		// create a entry, information comes from AJAX request from Angular
		Entry.create({
			name : req.body.name,
			company : req.body.company,
			poc : req.body.poc,
			date : req.body.date,
			timeIn : req.body.timeIn,
			timeOut : req.body.timeOut,
			purpose : req.body.purpose,
			done : false
		}, function(err, entry) {
			if (err)
				res.send(err);
			// get and return all the entries after you create another
			getEntries(res);
		});

	});

	// delete a entries
	app.delete('/api/entries/:entries_id', function(req, res) {
		Entry.remove({
			_id : req.params.entry_id
		}, function(err, entries) {
			if (err)
				res.send(err);

			getEntries(res);
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};