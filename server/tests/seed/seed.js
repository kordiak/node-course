const jwt         = require('jsonwebtoken');
const {ObjectID} = require('mongodb');


const {Todo}     = require('./../../models/todo');
const {User}     = require('./../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [{
  _id:     userOneID,
  email:   'user1@gmail.com',
  password:'userOnePass',
  tokens:[{
    access:'auth',
    token: jwt.sign({_id:userOneID,acces:'auth'},'123abc').toString()

  }]
},
{
  _id:      userTwoID,
  email:    'user2@gmail.com',
  password: 'userTwoPass'
}];



const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID,
    text: 'Second test todo',
    completed:true,
    completedAt:123
  }
];

const populateTodos = (done)=>
{
  Todo.remove({}).then(()=>
  {
     return Todo.insertMany(todos);
  })
  .then(()=>done())
  .catch((e)=>done(e));

  //done()).catch((e)=>done(e));

};

const populateUsers = (done)=>
{
  User.remove({}).
  then(()=>
  {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne,userTwo]);
  }).then(()=>done());
}

module.exports = {
  populateTodos,populateUsers,todos,users
}
