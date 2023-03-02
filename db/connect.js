const mongoose = require('mongoose');

const connectDB = (url) => {
    console.log('12');
    return mongoose.connect(url)
}

module.exports = connectDB;