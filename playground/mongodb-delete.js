

//const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');
var obj = new ObjectID();

var Connect = ( url ) =>
{
  var promise = new Promise( ( resolve, reject)=>
  {
    MongoClient.connect(url, (error,db) =>
    {
      if(error)
      {
        reject(error);
      }
      console.log('Connected');
      resolve(db);

    });
  });
  return promise;
}


var UserCreator = ()=>
{
  var body =
  {
    db : null,
    CreateUser : function ( document )
    {
      var promise = new Promise( ( resolve, reject ) =>
      {
        this.db.collection('Users').insertOne(document, (err,result) =>
        {
          if(err)
          {
            reject(this.db);
          }
          console.log('Added new user' + JSON.stringify(result.ops[0]._id.getTimestamp()));
          resolve(this.db);
        });



      });
      return promise;
    }
  };
  return body;


};



Connect('mongodb://localhost:27017/TodoApp').
then((db)=>
{

  // db.collection('Todos').deleteMany({text:'Lunch'})
  // .then( (result)=>
  // {
  //   console.log(result);
  // });

  // db.collection('Todos').deleteOne(
  //   {text:'Lunch'})
  //   .then(
  //     (result)=>
  //     {
  //       console.log(result);
  //     }
  //   )

  // db.collection('Todos').findOneAndDelete({ completed: false })
  // .then((result)=>
  // {
  //   console.log(result);
  // });


  // db.collection('Users').deleteMany({name: 'Piotr' })
  // .then((result)=>
  // {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndDelete({_id:new ObjectID('59f5d727ab35b041079f951b')})
  // .then(
  //   (result)=>
  //   {
  //     console.log(result);
  //   }
  // )

  db.collection('Users').deleteMany({name:'Szymon'});

//delete many
//delete one
//find one and delete


  db.close();
});
