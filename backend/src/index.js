import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";


const app = express();
const __dirname = path.resolve();


app.get("/msg",(req,res)=>{
    res.status(200).json({msg:"success from api"})
})

//deployment
if(ENV.NODE_ENV === "production"){
    //allows access of static index.js from index.html
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
 
    //any routes other than express api
    app.get("{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
}
app.listen(ENV.PORT,()=>console.log("Server running on port:",ENV.PORT))