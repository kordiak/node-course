
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb')


var app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>
{
  var todo = new Todo
  ({
    text: req.body.text
  });
  todo.save()
  .then(( document )=>
  {
    res.send(document);
  },
  (error)=>
  {
    res.status(400).send(error);
  });

  console.log(req.body);
});

app.get('/todos',(req,res)=>
{
  Todo.find().then((todos)=>
 {
   res.send({todos});
 },
 (e)=>
 {
  res.status(400).send(err);
 });
});


app.get('/todos/:id',(req, res)=>
{
  var id = req.params.id;
  if(ObjectID.isValid(id))
  {
    Todo.findById(id).then((todo)=>
    {
      if(todo != null)
      {
        res.send(todo);
      }
      else {
        res.status(404).send();
      }
    });
    //findbyid
      //if ok send back
      //if not send 404
      //400 back and empty body
    return;
  }

  res.status(400).send();
});

app.listen(3000, ()=>
{

  console.log('Started at port 3000');
});


module.exports = { app };
