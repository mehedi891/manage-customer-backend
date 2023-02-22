const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    img:{
        type:String,
    },
    role:{
        type:String,
        default: 'user'
    },
    password:{
        type:String,
        required:true
    },
    onlineStatus : {
        type: Boolean,
        default: false
    },
  },{timestamps : true  }
  );

  module.exports = mongoose.model('users',userModel);