const Joi = require('joi');

const validationOptions = {
    language: {
        key: '{{key}} ',
    },
};

class BaseValidator {
    static validate(schema, body) {
        schema = Joi.object().keys(schema);
        return Joi.validate(body, schema, validationOptions);
    }
}

module.exports = BaseValidator;