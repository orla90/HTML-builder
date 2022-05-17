const fs = require('fs');
const fsP = require('fs').promises;
const path = require('path');
const destProject = path.join(__dirname, 'project-dist');
const srcAssets = path.join(__dirname, 'assets');
const destAssets = path.join(__dirname, 'project-dist', 'assets');
const srcStyles = path.join(__dirname, 'styles');
const destStyles = path.join(__dirname, 'project-dist', 'style.css');
const destHTML = path.join(__dirname, 'project-dist', 'index.html');

const mkdir = (dir) => {
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
};

const copyFiles = (src, dest) => {
  let sourceFile = fs.createReadStream(src);
  let destinationFile = fs.createWriteStream(dest);
  sourceFile.pipe(destinationFile);
};

const copyDir = (src, dest) => {
  mkdir(dest);
  fs.readdir(src, (err, files) => {
    if (err) throw err;

    for (let i = 0; i < files.length; i += 1) {
      let pathToCheck = path.join(src, `${files[i]}`);
      fs.stat(pathToCheck, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else {
          copyFiles(path.join(src, files[i]), path.join(dest, files[i]));
        }
      });
    }
  });
};

const bundleFiles = (src, dest) => {
  let destinationFile = fs.createWriteStream(dest);
  let sourceFiles = [];
  fs.readdir(src, (err, files) => {
    if (err) throw err;

    for (let i = 0; i < files.length; i += 1) {
      let pathToCheck = path.join(src, `${files[i]}`);
      if (path.extname(pathToCheck) === '.css') sourceFiles.push(pathToCheck);
    }

    for (let i = 0; i < sourceFiles.length; i += 1) {
      fs.stat(sourceFiles[i], (err, stats) => {
        if (err) throw err;

        if (stats.isFile() && stats.size !== 0) {
          let sourceFile = fs.createReadStream(sourceFiles[i]);
          sourceFile.pipe(destinationFile);
        }
      });
    }
  });
};

const buildHTMLPage = async (src, dest) => {
  let template = await fsP.readFile(path.join(src, 'template.html'), 'utf-8');
  let destinationFile = fs.createWriteStream(dest);
  const tags = template.match(/{{(.*?)}}/g);
  let tagsArray = [];

  tags.forEach((tag) => {
    tagsArray.push(tag.slice(2, -2));
  });

  for (const tag of tagsArray) {
    let component = await fsP.readFile(
      path.join(src, 'components', `${tag}.html`),
      'utf-8'
    );
    template = template.replace(`{{${tag}}}`, component);
  }

  destinationFile.write(template);
};

(async () => {
  await fsP.rm(destProject, { recursive: true, force: true });
  await fsP.mkdir(destProject, { recursive: true });

  copyDir(srcAssets, destAssets);
  buildHTMLPage(__dirname, destHTML);
  bundleFiles(srcStyles, destStyles);
})();
