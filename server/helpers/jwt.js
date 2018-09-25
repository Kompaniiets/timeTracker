const jwt = require('jsonwebtoken');
const config = require('../../config');

class JwtManager {
    static sign(data) {
        return jwt.sign(data, config.jwt.jwtKey);
    }

    static verify(token) {
        return new Promise((resolve, reject) => jwt.verify(token, config.jwt.jwtKey, (err, decoded) => {
            if (err) return reject(err);

            if (Date.now() > decoded.expiresAt) {
                return reject('Token lifetime is expired');
            }
            return resolve(decoded);
        }));
    }
}

module.exports = JwtManager;
