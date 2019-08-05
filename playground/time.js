const moment = require('moment');

let someTimestamp = moment().valueOf();
console.log(someTimestamp);

let createdAt = 1234;
let date = moment(createdAt);  
// date.add(100,'year').subtract(9,'month');  
// console.log(date.format('ddd MMM Do, YYYY'));
console.log(date.format('h:mm a'));