const mongoose = require('mongoose');
const Validator = require('validator');
const validationSchema = new mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    email : {
        type : String,
        required : true,
        lowercase : true,
        validate : (value)=>{
            return Validator.isEmail(value);
        }
    },
    mobile : {type:String,default:'00-0000-000-000'},
    password : {type : String, required : true},
    role : {type:String, default:'user'},
    createdAt : {type : Date, default:Date.now}
})

const UserModel = mongoose.model('users',validationSchema);

module.exports = UserModel;