import express from "express";
import { ENV } from "./lib/env.js";


const app = express();

app.get("/msg",(req,res)=>{
    res.status(200).json({msg:"success from api"})
})
app.listen(ENV.PORT,()=>console.log("Server running on port:",ENV.PORT))