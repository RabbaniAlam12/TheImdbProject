const mongoose = require('mongoose');

const db = async() => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/imdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to the MongoDB database');
    } catch (err) {
        console.error(err);
    }
};

module.exports = db;