const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const admin = require("firebase-admin");
const johnny_five = require("johnny-five");


module.exports = {
  storeCycles: (data) => {
    let cycles = module.exports.objToArray(data);
    let timeArray = [];
    for (var j = 0; j < cycles.length; j++) {
      timeArray = timeArray.concat(cycles[j].roomsItemsTime);
    }
    return timeArray;

  },

  getLocalIp: () => {
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      console.log('addr: '+add);
    })
  },

  initializeStatus: (data) => {
    let rooms = module.exports.objToArray(data);
    console.log('rooms', rooms);
    for (var i = 0; i < rooms.length; i++) {
      let pins = rooms[i].pins.filter(x => x.hasOwnProperty('value') && x.value != false);
      for (var j = 0; j < pins.length; j++) {
        console.log("pins", pins[j].id);
        if (pins[j].type === "light") {
          console.log('it is not NAN');
          var led = new johnny_five.Led(pins[j].id);
          if (pins[j].value == 1 || pins[j].value == true || pins[j].value == "true") led.on();
        }
      }
    }
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
    return new Promise((resolve, reject) => {
      let entry = `value=${value} user=${user_id} date=${new Date().toString()} \n`
      console.log('entry', entry);
      if (value == "true" || value == true ) {
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
          console.log('index', index);
          if (index > -1) {
            console.log('value', value);
            result.pins[index].value = parseInt(value);
          }
          console.log('result', result);
          await admin.database().ref(ref).set(result);
          var led = new johnny_five.Led(idOut);
          if (value == 1) led.on();
          if (value == 0) led.off();
          // led.brightness(value)
          resolve(result.pins);
        })
      })

    });

  }


}
