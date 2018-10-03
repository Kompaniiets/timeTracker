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
        const id = uuid();

        const params = {
            TableName: 'workLogs',
            Item: {
                id: id,
                userId: userId,
                startTime: start,
                endTime: end,
                description: description,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        };

        await dynamoDb.put(params);
        return id;
    }

    /*
    Get all user log time
     */
    static async getAllLogs(userId, limit, LastEvaluatedKey) {
        const params = {
            TableName: 'workLogs',
            ExpressionAttributeValues: {
                ':uId': userId,
            },
            ExpressionAttributeNames: {
                "#userId": "userId",
            },
            FilterExpression: '#userId = :uId',
            // Limit: limit
        };

        return await scanExecute(params, limit, LastEvaluatedKey);

        // let items = [];
        // if (typeof LastEvaluatedKey !== 'undefined') {
        //     params.ExclusiveStartKey = LastEvaluatedKey;
        // }
        //
        // return dynamoDb.scan(params);
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

const scanExecute = async function (params, limit, LastEvaluatedKey) {
    if (typeof LastEvaluatedKey !== 'undefined') {
        params.ExclusiveStartKey = LastEvaluatedKey;
    }

    params.Limit = limit;

    const result = await dynamoDb.scan(params);

    if (result.Items.length < limit) {
        if(result.LastEvaluatedKey) {
            limit = limit - result.Items.length;
            LastEvaluatedKey = result.LastEvaluatedKey;

            const data = await scanExecute(params, limit, LastEvaluatedKey);

            result.Items = result.Items.concat(data.Items);
            result.Count = result.Count + data.Count;
            result.ScannedCount = result.ScannedCount + data.ScannedCount;
            result.LastEvaluatedKey = data.LastEvaluatedKey;

            return result;
        }
        return result;
    } else {
        return result;
    }
};

module.exports = WorksMiddleware;
