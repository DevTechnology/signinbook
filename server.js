// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8443; 				// set the port
var config = require('./config/config'); 			// load the database config
var morgan   = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors')
var https = require('https');
var fs = require('fs');

// configuration ===============================================================
mongoose.connect(config.database_url); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console

var corsOptions = {
    origin: 'https://s3.amazonaws.com'
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// scheduler for daily/monthly export
require('./app/scheduler/export.js');

// routes ======================================================================
require('./app/routes.js')(app);

var options = {
        key: fs.readFileSync('/certs/server.key'),
        cert: fs.readFileSync('/certs/server.crt'),
        ca: fs.readFileSync('/certs/rootCA.pem')
};

// listen (start app with node server.js) ======================================

https.createServer(options, app).listen(8443);

console.log("App listening on port " + port);
