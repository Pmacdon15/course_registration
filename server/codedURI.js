const readline = require('readline');
const copyPaste = require('copy-paste');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the words to change: ", (wordsToChange) => {
  const codedUri = encodeURIComponent(wordsToChange);
  console.log(codedUri);

  // Copy the encoded URI to the clipboard
  copyPaste.copy(codedUri);
  console.log('Encoded URI copied to clipboard.');

  rl.close();
});
