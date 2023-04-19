const imdbTitles = require('../../models/imdbModel.js')

function generateMovieMockData() {
    return new imdbTitles({
      primaryTitle: 'Pathaan',
      originalTitle: 'Pathaan',
      startYear: 2023,
      genres: 'Action'
    });
};

function generateTvShowMockData() {
    return new imdbTitles({
      primaryTitle: 'Modern Family',
      originalTitle: 'Modern Family',
      genres: 'Comedy'
    });
};

module.exports = { generateMovieMockData, generateTvShowMockData };

// export { generateMovieMockData, generateTvShowMockData };