const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const context = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(context);

stdout.write('Hi, enter anything word for write in the file \n');
stdin.on('data', (chunk) => {
  if (chunk.toString().includes('exit')) process.exit();
  output.write(chunk);
});
process.on('exit', () => stdout.write('Everything was writing, bye!\n'));
process.on('SIGINT', () => process.exit());
