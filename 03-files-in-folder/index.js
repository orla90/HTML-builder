const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');

let fileNames = [];

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    if (file.isFile()) {
      fileNames.push(file.name);
    }
  });

  for (let i = 0; i < fileNames.length; i += 1) {
    let pathToCheck = path.join(__dirname, 'secret-folder', `${fileNames[i]}`);
    fs.stat(pathToCheck, (err, stats) => {
      if (err) throw err;
      console.log(fileNames[i].replace('.', ' - ') + ' - ' + stats.size + 'b');
    });
  }
});
