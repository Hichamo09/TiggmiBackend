const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


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
