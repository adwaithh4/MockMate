import { chatClient } from "../lib/stream.js"

export async function getStreamToken(req,res){
    //stream token route handler
    try{
        //using clerkId for stream as we used it earlier
        const token = chatClient.createToken(req.user.clerkId)
        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image
        }) //can store as cookie in frontend
    }catch(error){
        console.log("Error in getStreamToken controller",error.message)
        req.status(500).json({message:"Internal Server Error"});
    }
}