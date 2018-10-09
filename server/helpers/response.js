module.exports = (status, body) => ({
    statusCode: status,
    headers: {
        "x-custom-header" : "Custom header",
        "Access-Control-Allow-Headers": "Content-Typ, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, X-Amz-User-Agent",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(body)
});