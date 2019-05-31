const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

//express middelware
const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.listen(process.env.PORT, () => {
  console.log(`The App is running in localhost: ${process.env.PORT}`);
})

app.get('/', (req, res) => {
  res.json('Hello World')
})
