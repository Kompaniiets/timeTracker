const CONSTANTS = require('../../constants');
const MailerFactory = require('./factory');
const mailer = MailerFactory.getInstance();

const params = [
    {
        "Template": {
            "TemplateName": CONSTANTS.SES_TEMPLATES.EMAIL_CONFIRMATION,
            "SubjectPart": "Email confirmation",
            "HtmlPart": "<h3>Hello {{firstName}}!</h3></br><p>Please click on the link to verify your email address <a href='{{confirmationLink}}'>verify</a></p>",
            "TextPart": "Hello {{firstName}}! \r\nPlease click on the link to verify your email address {{confirmationLink}}"
        }
    }
];

(async function bulkCreateTemplate() {
    for (let i = 0; i < params.length; i++) {
        try {
            await mailer.createTemplate(params[i]);
            console.log(data);
        } catch (err) {
            console.log(err, err.stack);
        }
    }
})();
