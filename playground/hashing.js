const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')

// jsw.sign
// jwt.verify

var data =
{
  id:10
}
var token = jwt.sign(data,'123abc');
console.log(token);

// const magicword = 'SECRET'
// //Server
// var data =
// {
//   id:4
// }
//
// var token =
// {
//   data,
//   hash: SHA256(JSON.stringify(data)+magicword).toString()
// }
//
//
//
//
// //------------
//
// console.log(token);
// var hash = SHA256(JSON.stringify(data)).toString();
// console.log(hash);
