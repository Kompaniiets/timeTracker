module.exports = (status, body) => ({
    statusCode: status,
    headers: {
        "x-custom-header" : "Custom header",
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    },
    body: JSON.stringify(body)
});

// Use in API Gateway integration type - Lambda Function
// {
//     "body" : $input.json('$')
// }