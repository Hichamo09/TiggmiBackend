const fs = require('fs');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const admin = require("firebase-admin");
const johnny_five = require("johnny-five");
const helpers = require('../lib/helpers');



module.exports = {
  updateStatus: async (req, res) => {

    let { idOut, value, user_id, room_id } = req.query
    console.log('here');
    if (!idOut || !value) return res.json({success: false, message: "missing params"})

    let result = await helpers.makeCommand(value, idOut, user_id, room_id);
    console.log('resut', result);
    res.json({success: true, message: 'done', pins: result})


    // if (!idOut || !value) return res.json({success: false, message: "missing params"})
    // if (value == "true" ) {
    //   console.log('true');
    //   value = 1
    // }else {
    //   console.log('false');
    //   value = 0
    // }
    // fs.writeFile(`${appDir}/${idOut}.txt`, value, async function (err) {
    //   if (err) return res.json({success: false, message: 'internal error'});
    //   let ref = `/users/${user_id}/rooms/${room_id}/`
    //   console.log('deooool');
    //   admin.database().ref(ref).once("value",async (snapshot) => {
    //     let result = snapshot.val();
    //     let index = result.pins.findIndex((x) => {
    //       return x.id == idOut
    //     });
    //     if (index > -1) {
    //       console.log('value', value);
    //       result.pins[index].value = parseInt(value);
    //     }
    //     console.log('result', result);
    //     await admin.database().ref(ref).set(result);
    //     return res.json({success: true, message: 'done'})
    //   })
    // })
  }
}
