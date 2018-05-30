// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');        // call express
var app = express();                 // define our app using express
var path = require('path');
var bodyParser = require('body-parser');
var axios = require('axios');
var fs = require('fs')

var ipcamera	= require('./hikvision');
var Scheduler = require('./scheduler')

var SSE = require('express-sse');
var sse = new SSE(["array", "containing", "initial", "content", "(optional)"]);

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/font',express.static(path.join(__dirname, 'fonts')))
var port = process.env.PORT || 4000;        // set our port
const SHOWER_API_URL = "http://192.168.0.106:5000/api"

fs.readFile('schedules.json', 'utf8', function(err,data){
	var data = JSON.parse(data)

	if(err)console.log(err)
	else app.locals.scheduler = new Scheduler(data.schedules, function(schedule){
																															console.log(schedule)
																															var id = schedule.showerId === "0" ? "14":"15"


																															axios.get(`http://192.168.0.106:5000/api/zalivaj/${id}/${schedule.duration}`)
																															.then(function (response) {
																																console.log(response);
																															})
																															.catch(function (error) {
																																console.log(error)
																															});

																														})

})


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});


// more routes for our API will happen here
router.get('/camera/alarm/stream', sse.init);


try{

	//initialize connection to hikvision camera alarm stream
	var options = {
		host	: '192.168.0.220',
		port 	: '80',
		user 	: 'admin',
		pass 	: 'Nomis1992!',
		log 	: true,
	};
	var hikvision 	= new ipcamera.hikvision(options);
	hikvision.on('alarm', function(code,action,index) {
		if (code === 'VideoMotion'   && action === 'Start'){
			console.log(getDateTime() + ' Channel ' + index + ': Video Motion Detected')
			sse.send({active:true});
		}
	});

}catch(e){
	console.log(e)
}


router.get('/weather', function(req, res){
		axios.get('https://api.darksky.net/forecast/b69e234c7d2acaee2e547c057c23d3d5/45.996813,14.332931')
	  .then(function (response) {
	    res.send(response.data)
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
})


router.get('/shower/status', function(req, res){
	axios.get(`${SHOWER_API_URL}/status`)
	.then(function (response) {
		res.send(response.data);
	})
	.catch(function (error) {
		console.log(error)
	});
})

router.get('/shower/:id/start/:duration', function(req, res){
	var id = req.params.id === "0" ? "14":"15"
	axios.get(`${SHOWER_API_URL}/zalivaj/${id}/${req.params.duration}`)
	.then(function (response) {
		res.send(response.data);
	})
	.catch(function (error) {
		console.log(error)
	});
})

router.get('/shower/stop', function(req, res){
	axios.get(`${SHOWER_API_URL}/stop`)
	.then(function (response) {
		res.send(response.data);
	})
	.catch(function (error) {
		console.log(error)
	});
})

router.get('/shower/schedules', function(req, res){
	fs.readFile('schedules.json', 'utf8', function(err, data){
		if(err)res.send(err)
		res.send(JSON.parse(data))
	})
})

router.post('/shower/schedule/add/shower/:id/:time/:duration', function(req, res){
	fs.readFile('schedules.json', 'utf8', function(err, data){
		if(err)res.send(err)
		data = JSON.parse(data)

		let scheduleId = Date.now()
		let newSchedule = {
			id: scheduleId,
			showerId: req.params.id,
			start_time: req.params.time,
			duration: req.params.duration
		}
		data.schedules.push(newSchedule)

		fs.writeFile('schedules.json', JSON.stringify(data), function(err){
			if(err)res.send(err)
			else{
				app.locals.scheduler.startNewSchedule(newSchedule, function(schedule){
																															console.log(schedule)
																															var id = schedule.showerId === "0" ? "14":"15"

																															axios.get(`http://192.168.0.106:5000/api/zalivaj/${id}/${schedule.duration}`)
																															.then(function (response) {
																																console.log(response.data);
																															})
																															.catch(function (error) {
																																console.log(error)
																															});

																														})
				res.send({id: scheduleId})
			}
		})
	})
})

router.delete('/shower/schedule/:id', function(req, res){

	fs.readFile('schedules.json', 'utf8', function(err, data){
		if(err)res.send(err)
		data = JSON.parse(data)

		data.schedules = data.schedules.filter((schedule, i)=> schedule.id !== parseInt(req.params.id))

		fs.writeFile('schedules.json', JSON.stringify(data), function(err){
			if(err)res.send(err)
			else {
				app.locals.scheduler.cancleSchedule(req.params.id)
				res.send("schedule delited")
			}
		})
	})
})

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
