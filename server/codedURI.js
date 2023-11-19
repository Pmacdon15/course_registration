const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the words to change: ", (wordsToChange) => {
  const codedUri = encodeURIComponent(wordsToChange);
  console.log(codedUri);

  rl.close();
});
