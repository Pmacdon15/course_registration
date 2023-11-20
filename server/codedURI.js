const copyPaste = require('copy-paste');

// Read from the clipboard
copyPaste.paste((err, wordsToChange) => {
  if (err) {
    console.error('Error reading from clipboard:', err);
    return;
  }
  const codedUri = encodeURIComponent(wordsToChange);
  console.log("Words to change: "+ wordsToChange);
  console.log("Coded URI: "+ codedUri);

  // Copy the encoded URI to the clipboard
  copyPaste.copy(codedUri);
  console.log('Encoded URI copied to clipboard.');
});
