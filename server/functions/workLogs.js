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
        let id, item;

        await validator.addLog(body);

        const userId = event.requestContext.authorizer.principalId;
        const startDate = moment(body.startDate).utc().valueOf(), endDate = moment(body.endDate).utc().valueOf();

        let logs = await middlewares.checkUserLogs(userId, startDate, endDate);

        if (logs.Count)
            return response(400, 'You already have logs in this time range!');

        id = await middlewares.saveTime(userId, startDate, endDate, body.description);
        console.log(id);
        item = await middlewares.getLogById(id);
        return response(200, { data: item.Item });
    } catch (error) {
        return response(400, error);
    }
};

/*
 Get list of user working logs handler
  */
module.exports.getAllLogs = async (event, context) => {
    try {
        const query = event.queryStringParameters || {};
        const limit = (Object.keys(query).length && query.limit) ? parseInt(query.limit) : 5;
        const lastKey = (Object.keys(query).length && query.lastKey) ? { id: query.lastKey } : undefined;
        const userId = event.requestContext.authorizer.principalId;

        const items = await middlewares.getAllLogs(userId, limit, lastKey);
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