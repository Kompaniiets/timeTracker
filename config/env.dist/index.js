const aws = require('./aws');
const ses = require('./ses');

const defaults = {
    url: 'xxx',
    jwt: {
        jwtKey: 'xxx',
    },
    aws: aws,
    ses: ses,
};

module.exports = defaults;