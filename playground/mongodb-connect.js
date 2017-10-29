




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
    var userCreator = UserCreator();
    userCreator.db = db;
    return userCreator.CreateUser({name:'Szymon', age: 29, location:'Katowice'});
    //console.log("OK");
    //db.collection('Todos').insertOne({text: 'Something to do',done: false})

}).
then((db)=>
{
  var userCreator = UserCreator();
  userCreator.db = db;
  return userCreator.CreateUser({name:'Piotr', age: 34, location:'Warszawa'});
}).
then((db)=>
{
    console.log('Disconnected');
    db.close();
});
