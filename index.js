const express =require("express")
const app =express();
require("./config/db");
const cors =require("cors");

const route = require("./Router/route");

 app.use(express.json())
 app.use(cors());
app.use(route);
app.listen(5000,()=>{
    console.log("server listening on port no 5000")
})