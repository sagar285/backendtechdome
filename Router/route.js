const route =require("express").Router();
const { loginauth, adminauth } = require("../Middleware/Auth");
const {register, login,loanrequest, allloanrequest,userloanrequest,statuschange, weeklypayment, repayment} =require("../controller/usercontroller")

route.post("/register",register)
route.post("/login",login)

route.get("/",(req,res)=>{
    res.send("home route working properly");
})

route.get("/loginverify",loginauth,(req,res)=>{
    res.send({ok:"user verify succesfully"});
})

route.get("/adminverify",loginauth,adminauth,(req,res)=>{
    res.send({ok:"admin verify successfully"});
})

route.get("/userloanrequest",loginauth,userloanrequest);


route.post("/loanrequest",loginauth,loanrequest)

route.get("/allloanrequest",loginauth,adminauth,allloanrequest)
route.put("/statuschange/:id",loginauth,adminauth,statuschange)

route.get("/weeklypayment",loginauth,weeklypayment)

route.put("/repayment/:repayamount",loginauth,repayment)

module.exports =route;

