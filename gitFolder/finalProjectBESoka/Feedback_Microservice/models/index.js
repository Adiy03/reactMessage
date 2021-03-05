const mongoose = require('mongoose');

const uri = "mongodb://localhost:27017/Soka"

mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }) // Make connection to mongodb penjualan_dev database

const feedback = require('./feedback')

module.exports = { feedback };
