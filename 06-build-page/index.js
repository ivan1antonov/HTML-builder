const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream/promises');

const destinationPath = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'styles');
const assetsSourcePath = path.join(__dirname, 'assets');
const assetsDestinationPath = path.join(__dirname, 'project-dist', 'assets');

async function createDirectory() {
  try {
    await fs.promises.rm(destinationPath, { force: true, recursive: true });
    await fs.promises.mkdir(destinationPath, { recursive: true });
    await createHtml();
    await copyStyles();
    await copyAssetsRecursive(assetsSourcePath, assetsDestinationPath);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function createHtml() {
  try {
    const template = path.join(__dirname, 'template.html');
    const mainHtml = path.join(__dirname, 'project-dist', 'index.html');
    await fs.promises.copyFile(template, mainHtml);

    const componentsPath = path.join(__dirname, 'components');
    const components = await fs.promises.readdir(componentsPath, {
      withFileTypes: true,
    });
    let htmlFile = await fs.promises.readFile(mainHtml, 'utf-8');
    let newHtmlFile = await replaceTags(components, componentsPath, htmlFile);
    await fs.promises.writeFile(mainHtml, newHtmlFile);
  } catch (error) {
    console.error(error.message);
  }
}

async function replaceTags(components, componentsPath, htmlFile) {
  try {
    for await (const file of components) {
      const filePath = path.join(componentsPath, file.name);
      if (file.isFile() && path.extname(file.name) === '.html') {
        const fileName = file.name.split('.')[0];
        const fileData = await fs.promises.readFile(filePath, 'utf-8');
        htmlFile = htmlFile.replace(`{{${fileName}}}`, fileData);
      }
    }
    return htmlFile; // Возвращаем измененный HTML файл
  } catch (error) {
    console.error(error.message);
    return htmlFile; // Возвращаем исходный HTML файл в случае ошибки
  }
}

async function copyStyles() {
  try {
    const files = await fs.promises.readdir(styles, { withFileTypes: true });
    const destPath = path.join(destinationPath, 'bundle.css');
    const writeStream = fs.createWriteStream(destPath);
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(styles, file.name);
        const fileExtension = path.extname(filePath);
        if (fileExtension === '.css') {
          const readStream = fs.createReadStream(filePath, 'utf-8');

          readStream.pipe(writeStream);
        }
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function copyAssetsRecursive(assetsSourcePath, assetsDestinationPath) {
  try {
    const assetsFiles = await fs.promises.readdir(assetsSourcePath, {
      withFileTypes: true,
    });
    for await (const file of assetsFiles) {
      const srcPath = path.join(assetsSourcePath, file.name);
      const destPath = path.join(assetsDestinationPath, file.name);
      if (file.isFile()) {
        const readStream = fs.createReadStream(srcPath);
        const writeStream = fs.createWriteStream(destPath);
        await pipeline(readStream, writeStream);
      } else if (file.isDirectory()) {
        await fs.promises.mkdir(destPath, { recursive: true });
        await copyAssetsRecursive(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createDirectory();
