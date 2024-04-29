const fs = require('fs');
const path = require('path');
const context = path.join(__dirname, 'secret-folder');

const sizeFile = (fileName, extNam, pathToFile) => {
  fs.stat(pathToFile, (err, stat) => {
    if (err) console.log(err.message);
    console.log(`${fileName}-${extNam}-${(stat.size / 1024).toFixed(3)}Kb`);
  });
};

fs.readdir(context, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err.message);
  files.forEach((el) => {
    if (el.isFile()) {
      const pathToFile = path.join(context, el.name);
      const extName = path.extname(el.name).slice(1);
      const fileName = el.name.split('.')[0];
      sizeFile(fileName, extName, pathToFile);
    }
  });
});
// if (err) console.log(err);
// else
//   files.forEach((el) => {
//     if (Symbol(type) !== 2) console.log(el);
//   });
