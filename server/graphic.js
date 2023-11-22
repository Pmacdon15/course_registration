module.exports = {
    displayGraphic(port) {
      console.log(`\x1b[31m
   _____            _     _             _   _             
  |  __ \\          (_)   | |           | | (_)            
  | |__) |___  __ _ _ ___| |_ _ __ __ _| |_ _  ___  _ __  
  |  _  /  _ \\/ _\` | / __| __| '__/ _\` | __| |/ _ \\| '_ \\ 
  | | \\ \\  __/ (_| | \\__ \\ |_| | | (_| | |_| | (_) | | | |
  |_|  \\_\\___|\\__, |_|___/\\__|_|  \\__,_|\\__|_|\\___/|_| |_|
               __/ |                                      
              |___/ \x1b[34m 
Backend server is listening on port ${port} \x1b[0m`);
    },
  };
module.exports.displayGraphic(5544);  