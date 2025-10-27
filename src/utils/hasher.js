const crypto = require('crypto');

const generateHash = (text) => {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return hash.digest('hex');
}

module.exports = {
    generateHash
};