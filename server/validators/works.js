const BaseValidator = require('../utils/baseValidator');
const Joi = require('joi');

class WorksValidator extends BaseValidator {
    static addLog(body) {
        return super.validate({
            startDate: Joi.date()
                .iso()
                .required()
                .max(Date.now()),
            endDate: Joi.date()
                .iso()
                .required()
                .max(Date.now()),
            description: Joi.string()
                .max(200)
                .required()
                .trim(),
        }, body);
    }
}

module.exports = WorksValidator;