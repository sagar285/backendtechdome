const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://wayseasy291:simplyjs@cluster0.7ntvhen.mongodb.net/loanapp").then(()=>{
    console.log("connection succesfull")
}).catch((e)=>{
    console.log(e);
})