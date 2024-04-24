const fs = require('fs');
const path = require('path');
const { stdout } = process;

const result = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(result, 'utf-8');

stream.on('data', (data) => stdout.write(data));
stream.on('error', (error) => console.log(error.message));
