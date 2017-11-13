const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos,users, populateTodos,populateUsers} = require('./seed/seed');


beforeEach(populateTodos);
beforeEach(populateUsers);


describe('Parameters',()=>
{

  it('Should be not undefined',()=>
  {

    expect(app).toNotEqual(undefined);
    //expect(Todo).toBeA('object');
  });


});

describe('Post todos', ()=>
{

  it('Should create a new todo',(done)=>
  {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect(
      (res)=>
      {
        expect(res.body.text).toBe(text);
      }
    )
    .end((err,res)=>
    {
      if(err)
      return done(err);

      Todo.find({text})
      .then((todos)=>
      {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      })
      .catch((e)=>{ done(e)})
  })
  });

  it('It should not create todo with invalid data',(done)=>
  {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err,res)=>
    {
      if(err)
      return done(err);

      Todo.find()
      .then((todos)=>
      {
        expect(todos.length).toBe(2);
        done();
      })
      .catch((err)=>
      {
        done(err);
      }
      )

    })

  });

});

describe('GET /todos', ()=>
{
  it('Should get all todos',(done)=>
{
  request(app)
  .get('/todos')
  .expect(200)
  .expect((res)=>
  {
    expect(res.body.todos.length).toBe(2);
  })
  .end(done);


});
});


describe('Get /todos/:id', ()=>
{
  it('should return todo doc', (done)=>
  {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect( (res)=>
    {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });


  it('Should return 404 if todo not found', (done)=>
  {
    const newId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${newId}`)
    .expect(404)
    .expect( (res) =>
    {
      expect(res.body.todo == null);
    }).end(done);
  });

  it('Should return 400 if we are sending wrong id',(done)=>
  {
    request(app)
    .get('/todos/123')
    .expect(400)
    .expect((res)=>
    {
      expect(res.body.todo == null);
    }).end(done);

  });

});

describe('DELETE /todos/:id',()=>
{
  const newId = todos[0]._id.toHexString();
  it('should remove a todo',(done)=>
  {
    request(app)
    .delete(`/todos/${newId}`)
    .expect(200)
    .expect((req)=>
    {
      expect(req.body.todo._id).toBe(newId);
    }).end((err,res)=>{
      if(err) return done(err);

      Todo.findById(newId).then((document)=>
      {
        expect(document).toNotExist();
        done();
      }).catch((e)=> done(e));
    });

  });

  it('should return 404 if not found',(done)=>
  {
    var notFound = new ObjectID();
    request(app)
    .delete(`/todos/${notFound.toHexString()}`)
    .expect(404)
    .end(done);

  });

  it('Should return 400 if not found',(done)=>
  {
    request(app)
    .delete('/todos/123gx')
    .expect(400)
    .end(done);
  });
});


describe('PATCH /todos/:id',()=>
{
it('Should update the todo', (done)=>
{

  const firstID = todos[0]._id.toHexString();
  const newText = 'New test text changed by patch';
  request(app)
  .patch(`/todos/${firstID}`)
  .send({text:newText,completed:true})
  .expect(200)
  .expect((res)=>
{
  expect(res.body.todo.text).toEqual(newText);
  expect(res.body.todo.completed).toBe(true);
  expect(res.body.todo.completedAt).toBeA('number');
}).end(done);
});

it('Should clear completedAt when todo is not completed',(done)=>
{
  const secondID = todos[1]._id.toHexString();
  const newText = 'New text of second todo';
  request(app)
  .patch(`/todos/${secondID}`)
  .send({completed:false,text:newText})
  .expect(200)
  .expect((resp)=>
  {
    expect(resp.body.todo).toExist();
    expect(resp.body.todo.text).toEqual(newText);
    expect(resp.body.todo.completed).toBe(false);
    expect(resp.body.todo.completedAt).toNotExist();
  }).end(done);
});

});


describe("Get /users/me", ()=>
{

//Validate token
it('Return user i authenicated',(done)=>{
request(app)
.get('/users/me')
.set('x-auth',users[0].tokens[0].token)
.expect(200)
.expect((res)=>
{
  expect(res.body._id).toBe(users[0]._id.toHexString());
  expect(res.body.email).toBe(users[0].email);
}).end(done);
});

it('Should return   404 if not authenticated',(done)=>{
//users/me

request(app)
.get('/users/me')
.expect(401)
.expect((res)=>{
  expect(res.body).toEqual({});
}).end(done)});

});

describe('POST /users',()=>{
  it('should create a user',(done)=>{
    var email = 'example@example.com';
    var password = '123mbl!';
    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect((res)=>{
      expect(res.header['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email)
    }).end((err)=>{
      if(err)
      {
        return done(err);
      }
      User.findOne({email}).then((user)=>{
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e)=>done(e));
    });

  });

  it('should return validation errors if request invalid',(done)=>{

    var invalidEmail = 'email@@vp.pl';
    var invalidPassword = '12';

    request(app)
    .post('/users')
    .send({email:invalidEmail,password:invalidEmail})
    .expect(400)
    .end(done)
  });

  it('should not create user in email in use',(done)=>{

    request(app)
    .post('/users')
    .send(users[0])
    .expect(400)
    .end(done);
    //email taken
    //400
  })
});


describe('post/users/login',()=>{
  it('should login user and return token',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res)=>{
      expect(res.headers['x-auth']).toExist();
    })
    .end((err,res)=>{
      if(err){
        done(err);
      }
      User.findById(users[1]._id).then((user)=>{

        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        })
        done();
      }).catch((e)=>done(e));
    });
  });

  it('should reject invalid login',(done)=>{
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'otherWrongPassword'
    })
    .expect(400)
    .expect((res)=>{
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err,res)=>{
      if(err){
        done(err);
      }
      User.findById(users[1]._id).then((user)=>{

        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e)=>done(e));
    });
  });
})
