const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' });

class BaseAwsClass {
    // constructor() {
    //     this.AWS = AWS;
    // }
}

module.exports = BaseAwsClass;