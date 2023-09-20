const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:Number,
        required:true,
        default:0,
    }
})


// password hashing

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password =await bcrypt.hash(this.password,10)
    next();
})

// jsonwebtoken function

userSchema.methods.generatetoken =function(){
     return jwt.sign({_id:this._id},"dkkfjdfkdkjfjkdfjkdfjkfjfjfdksjdkjfd")
}


const Userschema = mongoose.model("User",userSchema);

module.exports =Userschema;