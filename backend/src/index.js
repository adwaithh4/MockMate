import express from "express";

import path from "path";
import cors from "cors";
import {serve} from "inngest/express"
import {clerkMiddleware} from '@clerk/express'


import { ENV } from "./lib/env.js";
import connectDB from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js"


const app = express();
const __dirname = path.resolve();

//middleware

app.use(express.json())
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))
app.use(clerkMiddleware()) //adds auth to req


app.use("/api/inngest",serve({client: inngest,functions}))
app.use("/api/chat",chatRoutes)


app.get("/msg",protectRoute,(req,res)=>{
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
const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT || 3000, () => console.log("Server running on port:",ENV.PORT || 3000));

    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();