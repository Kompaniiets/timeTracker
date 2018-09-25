class SES {
    constructor(instance, options) {
        this.instance = instance;
        this.options = options;
    }

    send(userOptions) {
        Object.assign(this.options, userOptions);
        return this.instance.sendEmail(this.options).promise();
    }

    sendTemplate(userOptions) {
        Object.assign(this.options, userOptions);
        return this.instance.sendTemplatedEmail(this.options).promise();
    }

    createTemplate(options) {
        return this.instance.createTemplate(options).promise();
    }
}

module.exports = SES;