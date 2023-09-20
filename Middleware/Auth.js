const jwt = require("jsonwebtoken");

const User =require("../modal/Userschema");

// user login authentication

exports.loginauth =async(req,res,next)=>{
    try {
        const authuser = jwt.verify(req.headers.authorization,"dkkfjdfkdkjfjkdfjkdfjkfjfjfdksjdkjfd")
        req.user =authuser;
        next();
    } catch (error) {
        console.log(error);
    }
}


// admin login authentication

exports.adminauth =async(req,res,next)=>{
    try {
        const user =await User.findById(req.user._id);
        if(user.role!=1){
            return res.status(404).send({message:"unauthorized access"});
        }  
        else{
            next();
        }
    } catch (error) {
        return res.status(404).send({message:"error in admin login",error})
    }
}