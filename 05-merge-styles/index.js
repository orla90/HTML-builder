const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist', 'bundle.css');

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

bundleFiles(src, dest);
