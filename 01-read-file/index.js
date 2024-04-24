const fs = require('fs');
const path = require('path');

const result = path.join(__dirname, 'text.txt');
fs.readFile(result, 'utf-8', (err, data) => {
  if (!err) {
    process.stdout.write(data);
  } else {
    console.log(err.message);
  }
});
