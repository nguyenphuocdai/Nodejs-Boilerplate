const uuid = require('uuid');

function randomUUID() {
    return uuid.v1();
}

module.exports = {
    randomUUID: randomUUID
};