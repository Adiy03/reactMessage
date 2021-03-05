const express = require('express') // Import express
const app = express() // Make express app
const bodyParser = require('body-parser') // Import bodyParser
const feedbackRoutes = require('./routes/feedbackRoutes')
// const userRoutes = require('./routes/userRoutes');
const cors=require('cors')

app.use(cors())
//Set body parser for HTTP post operation
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

//set static assets to public directory
app.use(express.static('public'));

app.use('/feedback', feedbackRoutes);


app.listen(3002, () => console.log('Server running on localhost:3002')) // Run server with port 3000

module.exports = app; // exports app
