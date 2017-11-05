const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectID} = require('mongodb')
var todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID,
    text: 'Second test todo'
  }
]

beforeEach((done)=>
{
  Todo.remove({}).then(()=>
  {
     return Todo.insertMany(todos);
  })
  .then(()=>done())
  .catch((e)=>done(e));

  //done()).catch((e)=>done(e));

})


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
})
