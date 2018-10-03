const aws = require('./aws');
const ses = require('./ses');

const defaults = {
    url: 'xxx',
    jwt: {
        jwtKey: 'xxx',
        jwtLifeTime: 1000 * 60 * 60 * 24,
        jwtRefreshLifeTime: 1000 * 60 * 60 * 48,
    },
    aws: aws,
    ses: ses,
};

module.exports = defaults;