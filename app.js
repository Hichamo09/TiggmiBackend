const express = require('express');
const app = express();
const http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(3000);  //listen on port 80
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("./meetup-91213-firebase-adminsdk-xt8xt-34a92a8344.json");
const johnny_five = require("johnny-five");
const arduino_board = new johnny_five.Board({ port: "COM6"});
const RoomController = require('./lib/helpers');

io.on('connection', client => {
  console.log('socket client connected');
  client.on('event', async (data, cb) => {
    // RoomController.updateStatus()
    const {value, pin_id, room_id } = data;
    let result = await helpers.makeCommand(value, pin_id, process.env.USER_ID, room_id);
    cb(result)
  })
});



const helpers = require('./lib/helpers');
const cycles = require('./cron/cycles');

let crons = [];
arduino_board.on("ready", function() {
   console.log("Blinking Program is Ready for use!");
   (function () {
     let ref = `/users/${process.env.USER_ID}`;
     admin.database().ref(ref).on("value", (snapshot) => {
       helpers.initializeStatus(snapshot.val().rooms)
       crons = helpers.storeCycles(snapshot.val().cycles);
       for (var i = 0; i < crons.length; i++) {
         cycles.testCron(crons[i].startTime, process.env.USER_ID, crons[i].value, crons[i].pin, crons[i].id);
       }
     }, function (errorObject) {
       console.log("The read failed: " + errorObject.code);
     })
   })()
});




admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meetup-91213.firebaseio.com"
});




helpers.getLocalIp()

//routes
const apiRoutes = require('./routes/');

//express middelware



app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);



// app.listen(process.env.PORT, () => {
//   console.log(`The App is running in localhost: ${process.env.PORT}`);
// })

app.get('/', (req, res) => {

  res.json('Hello World')
})
