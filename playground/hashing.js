const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')



var password ='123abc!'

// bcrypt.genSalt(10, (err,salt)=>
// {
//   bcrypt.hash(password,salt, (err,hash)=>
//   {
//     console.log(hash);
//   });
// })

var hashed= '$2a$10$wM5Uv.72Qo/77WVze31VhuCaG383iapXjtpgN6fFEm1QLWFVmARQ2';
bcrypt.compare(password,hashed ,(err,res)=>
{
  console.log(res);
})
// jsw.sign
// jwt.verify
//
// var data =
// {
//   id:10
// }
// var token = jwt.sign(data,'123abc');
// console.log(token);

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
