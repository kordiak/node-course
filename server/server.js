
var express = require('express');
var bodyParser = require('body-parser');

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

  Todo.findByIdAndRemove(id).then((document)=>
  {
   if(document != null)
   {
     res.status(200).send(document);
     return;
   }

   res.status(404).send();

    }).catch((error)=>
    {
      res.status(404).send();
    });









//get the id
//validate the id
  //not valid return 404
//remove todo by id
  //succes
    //if no doc send 404
    //if doc send back with 200
  //error send 400 with empty boyd

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
    Todo.findById(id).then((document)=>
    {
      if(document != null)
      {
        res.status(200).send({document});
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
