/**
 * Middleware for error handling
 * @param next
 */
module.exports = (err, req, res, next) => {
    // if (err instanceof AppError) {
    //     return next(err);
    // }

    handleSequelizeErrors(err);

    return err;
};

function handleSystemErrors(err) {
    if (err instanceof TypeError)
        return err;
}

/**
 * Handle Sequelize constraint error
 * @private
 * @param error
 */
function handleSequelizeErrors(error) {
    error.status = 422;
}
