'use strict';
const response = require('../helpers/response');
const validator = require('../validators/works');
const middlewares = require('./../middlewares/works');
const moment = require('moment');

/*
 Create working logs handler
  */
module.exports.createLog = async (event, context) => {
    try {
        const body = JSON.parse(event.body);

        await validator.addLog(body);

        const userId = event.requestContext.authorizer.principalId;
        const startDate = moment(body.startDate).utc().valueOf(), endDate = moment(body.endDate).utc().valueOf();

        let logs = await middlewares.checkUserLogs(userId, startDate, endDate);

        if (logs.Count)
            return response(400, 'You already have logs in this time range!');

        await middlewares.saveTime(userId, startDate, endDate, body.description);
    } catch (error) {
        return response(400, error);
    }

    return response(200, 'Work log successfully created');
};

/*
 Get list of user working logs handler
  */
module.exports.getAllLogs = async (event, context) => {
    try {
        const query = event.queryStringParameters || {};
        // const limit =  (!Object.keys(query).length && query.limit) ? parseInt(query.limit) : 2;
        const lastKey = (!Object.keys(query).length && query.lastKey) ? query.lastKey : undefined;
        const userId = event.requestContext.authorizer.principalId;

        const items = await middlewares.getAllLogs(userId, lastKey);
        return response(200, items);
    } catch (error) {
        return response(400, error);
    }
};

/*
 Get single log by id
 */
module.exports.getLogById = async (event, context) => {
    try {
        const id = event.pathParameters.id;

        const items = await middlewares.getLogById(id);
        return response(200, items);
    } catch (error) {
        return response(400, error);
    }
};