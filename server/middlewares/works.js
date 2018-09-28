'use strict';
const dynamoDb = require('../aws/dynamoDB');
const uuid = require('uuid/v4');
const timestamp = require('../helpers/timestamp');

class WorksMiddleware {
    /*
    Check is user logs on this time already exist
     */
    static checkUserLogs(userId, start, end) {
        const params = {
            TableName: "workLogs",
            FilterExpression: 'userId = :uId AND :newStart < endTime AND :newEnd > startTime',
            ExpressionAttributeValues: {
                ":newStart": start,
                ":newEnd": end,
                ":uId": userId,
            }
        };

        return dynamoDb.scan(params);
    }

    /*
    Save working log time
     */
    static async saveTime(userId, start, end, description) {
        const params = {
            TableName: 'workLogs',
            Item: {
                id: uuid(),
                userId: userId,
                startTime: start,
                endTime: end,
                description: description,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        };

        return dynamoDb.put(params);
    }

    /*
    Get all user log time
     */
    static getAllLogs(userId, LastEvaluatedKey) {
        const params = {
            ExpressionAttributeValues: {
                ':uId': userId,
            },
            ExpressionAttributeNames: {
                "#userId": "userId",
            },
            FilterExpression: '#userId = :uId',
            TableName: 'workLogs'
        };

        if (typeof LastEvaluatedKey !== 'undefined') {
            params.ExclusiveStartKey = LastEvaluatedKey;
        }

        return dynamoDb.scan(params);
    }

    static getLogById(id) {
        const params = {
            Key: {
                id: id
            },
            TableName: 'workLogs',
        };

        return dynamoDb.get(params);
    }
}

module.exports = WorksMiddleware;
