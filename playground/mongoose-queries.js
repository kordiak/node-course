const {ObjectID} = require("mongodb")
 const {mongoose} = require("./../server/db/mongoose")
//  const {Todo} = require("./../server/models/todo")
//
//  var id = "59fa516a3a0e93c66439ba79"
//
//
// if(!ObjectID.isValid(id))
// {
//   console.log('ObjectID not valid');
//   return;
// }
//
//  Todo.find(
//    {
//      _id:id
//    }
//  ).then((todos)=>
// {
//   console.log('Todos',todos);
// })
//
//
// Todo.findOne({
//   _id: id
// }).then((todo)=>
// {
//   console.log("todo: ", todo);
// })
//
// Todo.findById(id).then((todo)=>
// {
//   console.log("Todo by id:", todo)
// })

const {User} = require("./../server/models/user")



var id = "59f6086794501d369f16331c"
const RESULT =
{
  FOUND:0,
  NOTFOUND:1,
  ERROR:2
}


var CheckIfExist = (id)=>
{
  var promise = new Promise((resolve,reject)=>
  {
    User.findById(id).then((user)=>
    {
      if(user)
      {
        console.log('User found:', user);
        resolve(RESULT.FOUND);
      }
      else
      {
        console.log('User not found');
        reject(RESULT.NOTFOUND);
      }
    }).catch((error)=>
    {
      console.log('Wrong id provided');
      reject(RESULT.ERROR);
    });
  })

  return promise;
}

module.exports = { RESULT, CheckIfExist }
