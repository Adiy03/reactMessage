const express = require('express') // Import express
const app = express() // Make express app
const bodyParser = require('body-parser') // Import bodyParser
const cors= require('cors')
const cookieSession = require('cookie-session')
const userRoutes = require('./routes/userRoutes');


app.use(cors())
//Set body parser for HTTP post operation
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

//set static assets to public directory
app.use(express.static('public'));

app.use('/', userRoutes);



app.listen(3005, () => console.log('Server running on localhost:3005')) // Run server with port 3000

module.exports = app; // exports app
