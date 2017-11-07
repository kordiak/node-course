

const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb')


var app = express();
const port = process.env.PORT || 3000;

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
app.delete('/todos/:id',(req,res)=>
{
  var id = req.params.id;
  if(!ObjectID.isValid(id))
  {
    return res.status(400).send();
  }

  Todo.findByIdAndRemove(id).then((todo)=>
  {
   if(todo != null)
   {
     res.status(200).send({todo});
     return;
   }

   res.status(404).send();

    }).catch((error)=>
    {
      res.status(404).send();
    });
});
app.patch('/todos/:id',(req,res)=>
{
  var id = req.params.id;
  var body = _.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id))
  {
    return res.status(400).send();
  }

  if(_.isBoolean(body.completed) && body.completed)
  {
    body.completedAt = new Date().getTime();
  }
  else
  {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>
{
  if(!todo)
  {
    return res.status(404).send();
  }
  res.status(200).send({todo});
}).catch((e)=>
{
   res.status(400).send();
})

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
        res.status(200).send({todo});
      }
      else {
        res.status(404).send();
      }
    });
    //findbyid
      //if ok send back
      //if not send 404
      //400 back and empty body

  }
  else {
    res.status(400).send();
  }


});

app.listen(port, ()=>
{

  console.log(`Started at port ${port}`);
});


module.exports = { app };
