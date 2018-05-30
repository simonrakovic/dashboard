var nodeSchedule = require('node-schedule');
var moment = require('moment');

/*
class Schedule{
  constructor(time, durration, showerId, jobId, startFunction){
    this.time = time
    this.durration = durration
    this.showerId = showerId
    this.jobId = jobId

    this.startFunction = startFunction()
  }

  Schedule.prototype.setStartFunction = function(startFunction){
    this.startFunction = startFunction()
  }

}
*/

class Scheduler{
  constructor(schedules, fnStart){
    this.scheudledJobs = init(schedules, fnStart)
  }
}

function init(schedules, fnStart){
  var scheudledJobs = {}


  schedules.forEach((schedule)=>{
    var startTime = moment(schedule.start_time, 'HH:mm')

    scheudledJobs[schedule.id] = {
                                  start_job: nodeSchedule.scheduleJob({hour: startTime.hours(), minute: startTime.minutes()}, ()=>fnStart(schedule)),
                                }
  })

    console.log(scheudledJobs)
  return scheudledJobs
}

///////////////////////////////////// PROTOTYPES ///////////////////////////////////////77


Scheduler.prototype.startNewSchedule = function(newSchedule, fnStart){
  var startTime = moment(newSchedule.start_time, 'HH:mm')

  this.scheudledJobs[newSchedule.id] = {
                                          start_job: nodeSchedule.scheduleJob({hour: startTime.hours(), minute: startTime.minutes()}, ()=>fnStart(newSchedule)),

                                        }
  console.log(this.scheudledJobs)
}

Scheduler.prototype.cancleSchedule = function(scheduleId){
  if(this.scheudledJobs[scheduleId]){
    this.scheudledJobs[scheduleId].start_job.cancel()
  }
}

module.exports =  Scheduler;
