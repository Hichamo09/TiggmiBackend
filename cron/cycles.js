var schedule = require('node-schedule');
const helpers = require('../lib/helpers');


module.exports = {
  testCron: (test, user, value, pin, room_id) => {
    let year = new Date().getFullYear(),
    month = new Date().getMonth(),
    day = new Date().getDate();
    console.log(test.split(":")[0], test.split(":")[1]);
    var date = new Date(year, month, day, test.split(":")[0], test.split(":")[1], 00);

    console.log(new Date().toString());
    console.log(date);
    var j = schedule.scheduleJob(date, function(){
      console.log('The answer to life, the universe, and everything!');
      helpers.makeCommand(value, pin, user, room_id);
    });

  }
}
