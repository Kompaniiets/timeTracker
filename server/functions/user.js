'use strict';
const response = require('../helpers/response');
const validator = require('../validators/users');
const middlewares = require('./../middlewares/users');

/*
 Register handler
  */
module.exports.register = async (event, context) => {
    const body = JSON.parse(event.body);

    try {
        await validator.register(body);
        let user = await middlewares.findUserByEmail(body.email, 'users');

        if (user.Count)
            return response(409, 'Email already registered');

        user = await middlewares.encryptPassword(body);
        user = await middlewares.saveUser(user);
        await middlewares.sendEmail(user);
    } catch (error) {
        return response(400, error);
    }

    return response(200, {});
};

/*
 Login handler
  */
module.exports.login = async (event, context) => {
    let body = JSON.parse(event.body);

    try {
        await validator.login(body);
        let item = await middlewares.findUserByEmail(body.email, 'users');
        const user = item.Items[0];

        if (!item.Count)
            return response(403, 'Invalid email address or password');

        await middlewares.comparePassword(body.password + user.salt, user.password);

        if (!user.isVerified)
            return response(400, 'Email address not verified!');

        

    } catch (error) {
        return response(400, error);
    }
};

/*
 Confirm email address handler
 */
module.exports.confirm = async (event, context) => {
    const token = event.queryStringParameters.token;

    try {
        const info = await middlewares.verifyEmailToken(token);
        await middlewares.checkToken(token);
        await middlewares.updateIsVerifiedFlag(info);
    } catch (error) {
        return response(400, error);
    }

    return response(200, 'OK');
};