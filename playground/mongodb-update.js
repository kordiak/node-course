

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
  db.collection('Users').findOneAndUpdate(
    {name: 'Johana'},
    {
      $set:
      {
        name: 'Johana'
      },
      $inc:
      {
        age: 1
      }
    },
    {
      returnNewDocument: true
    }
  )
  .then( (result) =>
  {
    console.log(result);
  })

  db.close();
})
