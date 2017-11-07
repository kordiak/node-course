const {ObjectID} = require("mongodb")
const {mongoose} = require("./../server/db/mongoose")
const {Todo} = require("./../server/models/todo")
const {User} = require("./../server/models/user")


// Todo.remove({}).then((result)=>
// {
//
// });
//
//
Todo.findOneAndRemove({_id:'59ff2b2a58900e4c8b961b65'}).then((document)=>
{

});

Todo.findByIdAndRemove('59ff2b2a58900e4c8b961b65').then((document)=>
{
  console.log(document)

});
