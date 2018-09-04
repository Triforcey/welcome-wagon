var chalk = require('chalk');

class Prompt {
  constructor(properties) {
    var prompt = require('prompt');
    prompt.message = chalk.white('');
    prompt.delimiter = ': ' + chalk.green();
    this.prompt = prompt;
    this.properties = properties;
  }
  run(details) {
    if (details == undefined) details = {};
    return new Promise((resolve, reject) => {
      this.prompt.start();
      this.prompt.get(this.properties, (err, results) => {
        Object.assign(details, results);
        this.results = details;
        if (err) return reject(err);
        resolve(details);
      });
    });
  }
}

module.exports = Prompt;
