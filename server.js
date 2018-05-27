// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var path = require('path');
var bodyParser = require('body-parser');

var ipcamera	= require('./hikvision');

var SSE = require('express-sse');
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'public')))

var port = process.env.PORT || 4000;        // set our port


//initialize connection to hikvision camera alarm stream
var options = {
	host	: '192.168.0.220',
	port 	: '80',
	user 	: 'admin',
	pass 	: 'Nomis1992!',
	log 	: true,
};
var hikvision 	= new ipcamera.hikvision(options);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});


// more routes for our API will happen here
router.get('/camera/alarm/stream', sse.init);

hikvision.on('alarm', function(code,action,index) {
	if (code === 'VideoMotion'   && action === 'Start'){
		console.log(getDateTime() + ' Channel ' + index + ': Video Motion Detected')
		sse.send({active:true});
	}
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


function getDateTime() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
}
