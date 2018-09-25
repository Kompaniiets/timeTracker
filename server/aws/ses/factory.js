const Mailer = require('./mailer');
const config = require('../../../config');
const AWS = require('aws-sdk');
AWS.config.update(config.aws);

const instance = new AWS.SES({ apiVersion: config.ses.apiVersion });

class SESFactory {
    static getInstance() {
        let mailOptions = {
            Source: config.ses.from,
        };
        return new Mailer(instance, mailOptions);
    }
}

module.exports = SESFactory;