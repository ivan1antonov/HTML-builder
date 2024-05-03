const fs = require('fs');
const path = require('path');
const pathSource = path.join(__dirname, 'styles');
const bundle = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(bundle);

fs.readdir(pathSource, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
    return;
  }
  files.forEach((file) => {
    const extName = path.extname(file.name);
    if (file.isFile() && extName === '.css') {
      const filePath = path.join(pathSource, file.name);
      const readStream = fs.createReadStream(filePath);

      readStream.pipe(writeStream);
    }
  });
});
