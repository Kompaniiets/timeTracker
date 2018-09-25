const BaseValidator = require('../utils/baseValidator');
const Joi = require('joi');

class UsersValidator extends BaseValidator {
    static register(body) {
        return super.validate({
            email: Joi.string()
                .email()
                .required()
                .max(129),
            firstName: Joi.string()
                .max(30)
                .required()
                .trim(),
            lastName: Joi.string()
                .max(30)
                .required()
                .trim(),
            password: Joi.string()
                .min(6)
                .max(50)
                .required(),
            confirmPassword: Joi.any().valid(Joi.ref('password'))
                .required()
        }, body);
    }

    static login(body) {
        return super.validate({
            email: Joi.string()
                .email()
                .required()
                .max(129),
            password: Joi.string()
                .min(6)
                .max(50)
                .required()
        }, body);
    }
}

module.exports = UsersValidator;