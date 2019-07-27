const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("./meetup-91213-firebase-adminsdk-xt8xt-34a92a8344.json");
const johnny_five = require("johnny-five");
const arduino_board = new johnny_five.Board();


arduino_board.on("ready", function() {
   console.log("Blinking Program is Ready for use!");

});


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meetup-91213.firebaseio.com"
});

// // var ArduinoFirmata = require(__dirname+'/../');
// var ArduinoFirmata = require('arduino-firmata');
// var arduino = new ArduinoFirmata()
// arduino.connect();
//
// arduino.on('connect', function(){
//   console.log("connect!! "+arduino.serialport_name);
//   console.log("board version: "+arduino.boardVersion);
//
//   var stat = true
//   setInterval(function(){
//     console.log(stat);
//     arduino.digitalWrite(3, stat);
//     arduino.digitalWrite(4, !stat);
//     stat = !stat;  // blink
//   }, 300);
// });



//routes
const apiRoutes = require('./routes/');

//express middelware
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`The App is running in localhost: ${process.env.PORT}`);
})

app.get('/', (req, res) => {

  res.json('Hello World')
})
