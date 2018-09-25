const AWS = require('aws-sdk');
const config = require('../../../config');
AWS.config.update(config.aws);

const dynamoDb = new AWS.DynamoDB.DocumentClient();

class DynamoDB {
    static async get(params) {
        return await dynamoDb.get(params).promise();
    }

    static async put(params) {
        return await dynamoDb.put(params).promise();
    }

    static async scan(params) {
        return await dynamoDb.scan(params).promise();
    }

    static async query(params) {
        return await dynamoDb.query(params).promise();
    }

    static async update(params) {
        return await dynamoDb.update(params).promise();
    }
}

module.exports = DynamoDB;