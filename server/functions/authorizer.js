const dynamoDb = require('../aws/dynamoDB');
const jwt = require('../helpers/jwt');
const CONSTANTS = require('../constants');

/*
Check user access token
 */
module.exports.auth = async (event, context, callback) => {
    const authToken = event.authorizationToken;
    if (!authToken)
        return response(403, 'Forbidden');

    const params = {
        ExpressionAttributeValues: {
            ':authToc': authToken,
        },
        FilterExpression: 'contains (accessToken, :authToc)',
        TableName: 'users',
    };

    try {
        const item = await dynamoDb.scan(params);
        if (!item.Count)
            return response(403, 'Forbidden');

        await jwt.verify(authToken.replace(CONSTANTS.AUTHORIZATION.STRATEGY, ''), false);

        return callback(null, generatePolicy(item.Items[0].id, 'Allow', event.methodArn));
    } catch (error) {
        return callback(error);
    }
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