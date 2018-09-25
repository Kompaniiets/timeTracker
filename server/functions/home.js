'use strict';
const response = require('../helpers/response');

module.exports.home = (event, context) => response(200, {
  time: `Hello! You visited our site ${new Date().toLocaleString()}`
});
