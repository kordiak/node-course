var mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
var {ObjectID} = require('mongodb')
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim:true,
    minlength:1,
    unique:true,
    validate:{
      validator: validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function ()
{
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,['_id','email']);
}

UserSchema.methods.generateAuthToken = function() {
  var user = this;

  var access = 'auth';
  var token = jwt.sign({ _id: user._id.toHexString(), access },'123abc').toString();
  user.tokens.push({access,token});

  return user.save().then(()=> {

    return token;
  });
};
UserSchema.statics.findByToken = function (token)
{
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify( token, '123abc');
  } catch (e) {
    return Promise.reject();
  } finally {

  }
  return User.findOne({
    '_id': decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}

UserSchema.statics.findByCredentials = function (email,password){
  var User = this;
  return User.findOne({email}).then((user)=>{
    if(!user){
      return Promise.reject();
    }

    return new Promise((resolve, reject)=>
    {
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res){
          resolve(user);
        }
        reject();
      })
    })

  })
};

UserSchema.pre('save',function (next) {
  var user = this;
   if(user.isModified('password')){
     var password = user.password;

     bcrypt.genSalt(10,(err,salt)=>{
       bcrypt.hash(password,salt, (err,hash)=>{
          if(hash)
          {
            user.password = hash;
            next();
          }

          next(new Error('Unable to create user'));
       });
     });

   }
   else {
     next();
   }
});




var User = mongoose.model('User',UserSchema);

module.exports =
{
  User
}
