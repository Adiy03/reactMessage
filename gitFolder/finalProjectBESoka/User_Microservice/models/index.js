const path = require('path');
require('dotenv').config({
path: `.env.${process.env.NODE_ENV}`
})
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI 

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true,useCreateIndex:true  })

const user = require('./user.js')

module.exports = { user};
