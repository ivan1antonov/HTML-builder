const fsPromise = require('fs').promises;
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromise.rm(destDir, { force: true, recursive: true });
    await fsPromise.mkdir(destDir, { recursive: true });
    const copyDir = await fsPromise.readdir(sourceDir, { withFileTypes: true });
    copyDir.forEach((file) => {
      const fileSourceName = path.join(sourceDir, file.name);
      const fileDestName = path.join(destDir, file.name);
      fsPromise.copyFile(fileSourceName, fileDestName);
    });
  } catch (error) {
    console.log(error.message);
  }
}

copyDir();
