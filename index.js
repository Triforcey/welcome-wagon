require('dotenv').config();

var phoneFormatter = require('phone-formatter');
var asciiArt = require('ascii-art');
var clear = require('clear');

var Prompt = require('./prompt.js');
var db = new (require('./database.js'))(process.env.DB_URL, process.env.DB_NAME);
function promptInfo() {
  clear();
  console.log();
  asciiArt.font('CS19', 'Doom', text => {
    console.log(text);
    new Prompt({
      properties: {
        name: {
          description: 'Welcome! Enter your name',
          type: 'string',
          required: true
        },
        contact: {
          description: 'Would you like to be contacted by number, email, or both?',
          message: 'Must choose either number, email, or both',
          type: 'string',
          required: true,
          pattern: /^n(u|$)(m|$)(b|$)(e|$)(r|$)$|^e(m|$)(a|$)(i|$)(l|$)$|^b(o|$)(t|$)(h|$)$/i,
          before: value => {
            return value[0] == 'n' ? 'number' : value[0] == 'e' ? 'email' : 'both';
          }
        }
      }
    }).run().then(results => {
      var contactChoice = results.contact;
      var properties = {};
      if (contactChoice == 'number' || contactChoice == 'both') properties.number = {
        description: 'Enter phone number',
        message: 'Must be a valid phone number',
        type: 'string',
        required: true,
        pattern: /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/,
        before: value => {
          return phoneFormatter.format(value, '(NNN) NNN-NNNN');
        }
      };
      if (contactChoice == 'email' || contactChoice == 'both') properties.email = {
        description: 'Enter email',
        message: 'Must be a valid email',
        type: 'string',
        required: true,
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      };
      return new Prompt({ properties: properties }).run(results);
    }).then(results => {
      db.addUser(results).then(() => {
        asciiArt.font('Thanks!', 'Doom', text => {
          console.log(text);
          setTimeout(promptInfo, 5000);
        });
      });
    });
  });
}
db.connect().then(() => {
  promptInfo();
});
