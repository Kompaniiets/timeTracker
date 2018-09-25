'use strict';
const cryptoManager = require('../helpers/cryptoManager');
const dynamoDb = require('../aws/dynamoDB');
const uuid = require('uuid/v4');
const timestamp = require('../helpers/timestamp');
const MailerFactory = require('../aws/ses/factory');
const mailer = MailerFactory.getInstance();
const CONSTANTS = require('../constants');
const config = require('../../config');
const jwt = require('jsonwebtoken');

class UsersMiddleware {
    /*
    Encrypt user password
     */
    static async encryptPassword(body) {
        body.salt = cryptoManager.generateSalt();
        body.rawPassword = body.password;
        body.password = cryptoManager.hash(body.password + body.salt);
        return body;
    }

    /*
    Compare passwords
     */
    static comparePassword(password, hashedPassword) {
        if (!cryptoManager.compare(password, hashedPassword))
            throw 'Invalid email address or password';
    }

    /*
    Find user by email
     */
    static findUserByEmail(email, table) {
        const params = {
            ExpressionAttributeValues: {
                ':e': email,
            },
            FilterExpression: 'contains (email, :e)',
            TableName: table,
        };

        return dynamoDb.scan(params);
    }

    /*
    Find item by Id
     */
    static findById(id, table, param = {}) {
        const params = {
            Key: {
                id: id
            },
            TableName: table,
        };

        return dynamoDb.get(params);
    }

    /*
    Save user
     */
    static async saveUser(user) {
        const params = {
            TableName: 'users',
            Item: {
                id: uuid(),
                email: user.email,
                password: user.password,
                salt: user.salt,
                firstName: user.firstName,
                lastName: user.lastName,
                isVerified: false,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        };

        await dynamoDb.put(params);
        return params.Item;
    }

    /*
    Update user data
     */
    static updateIsVerifiedFlag(user) {
        const params = {
            TableName: 'users',
            Key: {
                'id' : user.userId,
            },
            UpdateExpression: 'set isVerified = :v',
            ExpressionAttributeValues: {
                ':v' : true
            }
        };

        return dynamoDb.update(params);
    }

    /*
    Save confirmation data to DynamoDB and send email to user
     */
    static async sendEmail(user) {
        const confirmationToken = jwt.sign({
            userId: user.id,
            createTime: Date.now(),
            expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        }, config.jwt.jwtKey);

        const emailParams = {
            Template: CONSTANTS.SES_TEMPLATES.EMAIL_CONFIRMATION,
            Destination: {
                ToAddresses: [user.email]
            },
            TemplateData: JSON.stringify({
                firstName: user.firstName,
                confirmationLink: `${config.url}/me/confirm?token=${confirmationToken}`
            })
        };

        const params = {
            TableName: 'tokens',
            Item: {
                userId: user.id,
                userEmail: user.email,
                tokenValue: confirmationToken,
                details: emailParams,
                createdAt: timestamp,
                updatedAt: timestamp,
            }
        };

        try {
            return await dynamoDb.put(params)
                .then(() => mailer.sendTemplate(emailParams));
        } catch (err) {
            console.log('err ', err);
        }
    }

    /*
    Verify confirmation email token
     */
    static verifyEmailToken(token) {
        return new Promise((resolve, reject) => jwt.verify(token, config.jwt.jwtKey, (err, decoded) => {
            if (err) return reject(err);

            if (Date.now() > decoded.expiresAt) {
                return reject('Token lifetime is expired');
            }
            return resolve(decoded);
        }));
    }

    /*
    Check token in DB
     */
    static checkToken(token) {
        const params = {
            ExpressionAttributeValues: {
                ':t': token,
            },
            FilterExpression: 'contains (tokenValue, :t)',
            TableName: 'tokens',
        };

        return dynamoDb.scan(params)
            .then((item) => {
                if (!item.Count) {
                    throw ('Invalid token!');
                }
            })
    }
}

module.exports = UsersMiddleware;
