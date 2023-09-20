const mongoose = require("mongoose")

const loanschema = new mongoose.Schema({
    userid:{
        type:mongoose.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number,
        required:true,
    },
    term:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        required:true,
    },
    status:{
        type:String,
        default:"Pending",
        enum:["Pending","Approved"]
    }
})

const Loanmodal =new mongoose.model("Loan",loanschema);

module.exports=Loanmodal;