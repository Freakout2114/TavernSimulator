const fs = require('fs');
const path = require('node:path');

module.exports = function(filePath) {
    const fileDir = path.join(__dirname, filePath);
    const rawdata = fs.readFileSync(fileDir);
    return JSON.parse(rawdata);
}