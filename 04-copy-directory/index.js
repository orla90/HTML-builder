const fs = require('fs');
const path = require('path');
const fsP = require('fs').promises;
const src = path.join(__dirname, 'files');
const dest = path.join(__dirname, 'files-copy');

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

(async () => {
  await fsP.rm(dest, { recursive: true, force: true });
  copyDir(src, dest);
})();
