const Usermodal =require("../modal/Userschema");
const loanmodal =require("../modal/Loanschema");
const bcrypt = require("bcryptjs");

let arrayforrepayment =[];

// registration request function
exports.register =async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        if(!name || !email || !password){
            return res.status(404).json({message:"pls filled all your field",status:404});
        }
        else{
            const usercheck = await Usermodal.findOne({email})
            if(usercheck){
                return res.status(400).send({message:"This user already registered",status:400})
            }else{
                const newuser  = new Usermodal({name,email,password});
                const saveduser =await newuser.save();
               return res.send({saveduser,status:200});
            }
        }
    } catch (error) {
        return res.json({message:"user registration error",error})
    }
}


// login request function
exports.login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(404).json({message:"pls filled all your field",status:404});
        }
        const usercheck = await Usermodal.findOne({email});
        if(usercheck){
               const passwordcheck = await bcrypt.compare(password,usercheck.password);
               if(passwordcheck){
                const token = await usercheck.generatetoken();
                return res.status(200).send({message:"user login succesfully",usercheck,token})
               }
               else{
                return res.status(400).send({message:"incorrect email or password"})
               }
        }
        else{
            return res.status(400).send({message:"This user is not registered in our database"});
        }
        
    } catch (error) {
        return res.json({message:"user login error",error})
        
    }
}


exports.loanrequest =async(req,res)=>{
    try {
    const {amount,date,term}=req.body;
   
    if(!amount || !date || !term){
        return res.status(404).send({message:"pls filled all your field"})
    }
    const newloan = new loanmodal({userid:req.user._id,amount,term,date});
    const saveloan = await newloan.save();
    res.status(200).send({message:"loan request succesfull",saveloan});

    } catch (error) {
        return res.status(404).send({message:"error in backend"});
    }
}



exports.userloanrequest =async(req,res)=>{
    try {
        
        const request = await loanmodal.findOne({userid:req.user._id});
        // console.log(request)
        if(!request){
            res.status(200).send("no loan request found");
        }

       else if(request.amount===0){
            const deleteloan = await loanmodal.findOneAndDelete({userid:req.user._id})
            res.status(200).send("no loan request")
        }
        else{
            const data = await loanmodal.findOne({userid:req.user._id}).populate("userid","name");
            res.status(200).send(request);
        }

    } catch (error) {
        return res.status(404).send({message:"error in backend"}); 
    }
}



exports.allloanrequest =async(req,res)=>{
    try {
        const loanrequests = await loanmodal.find({}).populate("userid","name")
        res.status(200).send(loanrequests);
        
    } catch (error) {
        return res.status(404).send({message:"error in backend"}); 
    }
}


exports.statuschange=async(req,res)=>{
    try {
        const {id}=req.params;
        const {status}=req.body;
        const update = await loanmodal.findByIdAndUpdate(id,{status:status},{new:true})
       return res.status(200).send(update);
    } catch (error) {
        return  res.status(500).send({message:"error in backend",error});
    }
}


exports.weeklypayment =async(req,res)=>{
    try {
        const userresult = await loanmodal.findOne({userid:req.user._id})
        if(userresult&& userresult.status=="Approved"){
            // res.redirect("http://localhost:5173/auth/dashboard")
            const noofweeks = userresult.term;
            const date =userresult.date;
            let paymentsetup = userresult.amount/userresult.term;
             const newpayment=parseFloat(paymentsetup).toFixed(2)
            res.status(200).send({noofweeks,newpayment,arrayforrepayment,date})
        }
        else{
            res.status(200).send({message:"your loan request is pending"});
        }

    } catch (error) {
        return  res.status(500).send({message:"error in backend",error});
        
    }
}


exports.repayment =async(req,res)=>{
    try {
        const {repayamount}=req.params;
        const id =req.user._id;
        const data = await loanmodal.findOne({userid:req.user._id})
        if(data && data.amount){
            let newterm =data.term-1;
            let loanamount = data.amount-repayamount;
            data.amount=loanamount;
            const update = await loanmodal.findOneAndUpdate({userid:req.user._id},{amount:data.amount,term:newterm},{new:true})
            res.send({update});
        }
    } catch (error) {
        return  res.status(500).send({message:"error in backend",error});
        
    }
}



