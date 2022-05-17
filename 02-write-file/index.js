const fs = require('fs');
const path = require('path');
const readline = require('readline');
const output = path.join(__dirname, 'text.txt');
const { stdin: input } = require('process');
const rl = readline.createInterface({ input });

fs.open(output, 'a', (err) => {
  if (err) throw err;
  console.log('Введите текст для записи в файл:\n');
});

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('\nХорошего дня!\n');
    process.exit();
  }
  fs.appendFile(output, input + '\r\n', (err) => {
    if (err) throw err;
  });
});

process.on('SIGINT', () => {
  console.log('\nХорошего дня!\n');
  process.exit();
});
