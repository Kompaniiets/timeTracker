const dynamoDb = require('../aws/dynamoDB');
const jwt = require('../helpers/jwt');
const CONSTANTS = require('../constants');
const response = require('../helpers/response');

/*
Check user access token
 */
module.exports.auth = (event, context, callback) => {
    const authToken = event.authorizationToken;
    let itemData;

    if (!authToken)
        return response(403, 'Forbidden');

    const params = {
        ExpressionAttributeValues: {
            ':authToc': authToken,
        },
        FilterExpression: 'contains (accessToken, :authToc)',
        TableName: 'users',
    };

    dynamoDb.scan(params)
        .then((item) => {
            if (!item.Count)
                return response(403, 'Forbidden');

            itemData = item.Items[0].id;
        })
        .then(() => jwt.verify(authToken.replace(CONSTANTS.AUTHORIZATION.STRATEGY, ''), false))
        .then(() => callback(null, generatePolicy(itemData, 'Allow', event.methodArn)))
        .catch((err) => callback(err));
};

const generatePolicy = function(principalId, effect, resource) {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
};