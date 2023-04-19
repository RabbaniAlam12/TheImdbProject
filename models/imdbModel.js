const mongoose = require('mongoose');

const imdbSchema = new mongoose.Schema({
    primaryTitle: String,
    originalTitle: String,
    startYear: Number,
    genres: String,
},
{collection: 'titles'});

const imdbTitles = mongoose.model('imdbTitles', imdbSchema);

module.exports = imdbTitles;