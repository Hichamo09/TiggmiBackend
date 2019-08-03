const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const admin = require("firebase-admin");
const johnny_five = require("johnny-five");


module.exports = {
  storeCycles: (data) => {
    let cycles = module.exports.objToArray(data);
    console.log('cycles', cycles);
    let timeArray = [];
    for (var j = 0; j < cycles.length; j++) {
      timeArray = timeArray.concat(cycles[j].roomsItemsTime);
    }
    console.log('timeArray', timeArray);
    return timeArray;

  },

  // IDEA: convert firebase response to array
  objToArray: (obj) => {
    if (!obj) return [];
    let arr = [];
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      arr.push({
        id: keys[i],
        ...obj[keys[i]]
      })
    }
    return arr;
  },

  makeCommand: (value, idOut, user_id, room_id) => {
    let entry = `value=${value} user=${user_id} date=${new Date().toString()} \n`
    console.log('entry', entry);
    if (value == "true" ) {
      console.log('true');
      value = 1
    }else {
      console.log('false');
      value = 0
    }
    console.log('rooom_id', room_id);
    fs.appendFile(`${appDir}/log.txt`, entry, async function (err) {
      if (err) return res.json({success: false, message: 'internal error'});
      let ref = `/users/${user_id}/rooms/${room_id}/`
      console.log('deooool');
      admin.database().ref(ref).once("value",async (snapshot) => {

        let result = snapshot.val();
        let index = result.pins.findIndex((x) => {
          return x.id == idOut
        });
        if (index > -1) {
          console.log('value', value);
          result.pins[index].value = parseInt(value);
        }
        console.log('result', result);
        await admin.database().ref(ref).set(result);
        var led = new johnny_five.Led(idOut);
        if (value === 1) led.on();
        if (value === 0) led.off();
        // led.brightness(200)
        return result.pins;
      })
    })
  }


}
