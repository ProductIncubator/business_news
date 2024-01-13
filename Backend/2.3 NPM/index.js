// write
// const fs = require('node:fs');
// const content = 'Some test content!';
// fs.appendFile('file.txt', content, err => {
//   if (err) {
//     console.error(err);
//   }
//     console.error('File succesfully saved!');
// });


// read
// const fs = require('node:fs');
// fs.readFile('file.txt', 'utf8',
//     (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(data);
// });


// as commonjs
// var generateName = require("sillyname");
// var sillyName = generateName();
// console.log(sillyName)

// as modul
// import generateName from "sillyname";
// var sillyName = generateName();
// console.log(sillyName)


// superheroes

import heroName from 'superheroes';

 
var name = heroName.random();

console.log(name);

