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

        return response(200, {});
    } catch (error) {
        return response(400, error);
    }
};

/*
 Login handler
  */
module.exports.login = async (event, context) => {
    const body = JSON.parse(event.body);

    try {
        await validator.login(body);
        const item = await middlewares.findUserByEmail(body.email, 'users');

        if (!item.Count)
            return response(403, 'Invalid email address or password');

        let user = item.Items[0]; // Get user data

        await middlewares.comparePassword(body.password + user.salt, user.password);

        if (!user.isVerified)
            return response(400, 'Email address not verified!');

        user = await middlewares.createUserToken(user);
        await middlewares.updateUserToken(user);
        user = await middlewares.formatUserData(user);

        return response(200, user);
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