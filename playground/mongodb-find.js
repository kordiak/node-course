

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
  // db.collection('Todos').
  // find(
  //   {
  //     _id: new ObjectID('59f5cc15ab35b041079f90ed')
  //   }
  //   ).toArray().
  // then((documents )=>
  // {
  //   console.log('TODOS');
  //   console.log(JSON.stringify(documents,undefined,2));
  // },
  // ( error ) =>
  // {
  //   console.log(`Error: ${error}`);
  // }
  // );
  db.collection('Users').
  find({ name: 'Mateusz ' }).toArray().
  then((documents )=>
  {
    console.log('TODOS');
    console.log(JSON.stringify(documents,undefined,2));
  },
  ( error ) =>
  {
    console.log(`Error: ${error}`);
  }
  );

  db.close();
});//.

// then((db)=>
// {
//   var userCreator = UserCreator();
//   userCreator.db = db;
//   return userCreator.CreateUser({name:'Piotr', age: 34, location:'Warszawa'});
// }).
