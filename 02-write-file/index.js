const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;
const context = path.join(__dirname, 'text.txt');
const streamWrite = fs.createWriteStream(context);

stdout.write('Hi, enter anything word for write in the file \n');
stdin.on('data', (chunk) => streamWrite.write(chunk));
stdin.on('error', (error) => stdout.write('All was write in file'));
