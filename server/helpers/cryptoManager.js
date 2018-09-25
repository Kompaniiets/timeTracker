const crypto = require('crypto');

class CryptoManager {
    static generateSalt() {
        return crypto.randomBytes(16).toString('hex');
    }

    static hash(password) {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    static compare(password, hashedPassword) {
        return crypto.createHash('md5').update(password).digest('hex') === hashedPassword;
    }
}

module.exports = CryptoManager;
