import { chatClient, streamClient } from "../lib/stream.js"
import  Session  from "../models/Session.js"

export async function createSession(req,res){
    try{
      const {problem,difficulty} = req.body
      const userId = req.user._id
      const clerkId = req.user.clerkId

      if(!problem||!difficulty){
        return res.status(400).json({message:"Problem and difficluty are required"})
      }
      //unique id for stream video call
      const callId = `sessiom_${Date.now()}_${Math.random().toString(36).substring(7)}`

      //create session in db
      const session = await Session.create({problem,difficulty,host: userId,callId})

      //stream video call
      await streamClient.video.call("default",callId).getOrCreate({
        data:{
            created_by_id:clerkId,
            custom: {problem , difficulty, sessionId: session._id.toString()}
        },    
      });

      //stream chat messaging
      const channel = chatClient.channel("messaging",callId,{
       name:`${problem} Sessiom`,
       created_by_id:clerkId,
       members:[clerkId]

      })

      await channel.create()
      res.status(201).json({session})

    }catch(error){
        console.log("Error in createSession controller",error.message)
        res.status(400).json({message:"Internal server error"})
    }
} 
export async function getActiveSessions(req,res){

    try{
        const sessions = await Session.find({status:active})
        .populate("host","name profileImage email clerkd")
        .sort({createdAt:-1})
        .limit(20);

        res.status(200).json({sessions})


    }catch(error){
                console.log("Error in getActiveSessions controller:",error.message)
                res.status(500).json({message :"Internal Server Error"})

    }
}
export async function getMyRecentSessions(req,res){
    try{
        const userId = req.user._id
        const sessions = await Session.find({
            status:"completed",
            $or : [{host:userId},{participant: userId}],
        })
        .sort({createdAt:-1})
        .limit(20);
        res.status(200).json(sessions)
    }catch(error){
        console.log("Error in getRecenteSessions controller:",error.message)
        res.status(500).json({message :"Internal Server Error"})

    }
}
export async function getSessionById(req,res){
    try{
        const{id}= req.params;
        const session = (await Session.find(id))
        .populate("host","name email profileImage clerkId")
        .populate("participant","name email profileImage clerkId")
        if(!session) return res.status(404).josn({message : "Session not found"})
        res.status(200).json({session});
            
    }catch(error){

        console.log("Error in getActiveSessions controller:",error.message)
        res.status(500).json({message :"Internal Server Error"})
     }
}
export async function joinSession(req,res){
    try{
        const{id} = req.params //sessionid
        const userId = req.user._id;
        const clerkId = req.user.clerkId

        const session = await Session.findById(id);

        //validations
        if(!session) return res.status(404).json({message : "Session not found"})

        if(session.status !='active'){
            return res.status(400).json({message: "Session not found"})
        }   
        if(session.host.toString()===userId.toString()){
            return res.status(400).json({message: "Host cannot join their own session as participant"})
        }
        //check session is already full - already has a particpant
        if(session.participant) return res.status(404).json({message : "Session is full"})

            
        session.participant = userId
        await session.save();

        //adds participant to strem chat
        const channel = chatClient.channel("messaging",session.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({session})
    }catch(error){

        console.log("Error in joinSession controller:",error.message)
        res.status(500).json({message :"Internal Server Error"})
    }
}
export async function endSession(req,res){
    try{

        const{id} = req.params //sessionid
        const userId = req.user._id;

        const session = await Session.findById(id);
        if(!session) return res.status(404).json({message : "Session not found"})
        //check if user is host
    if(session.host.toString() != userId.toString()){
        return res.status(403).json({message :"Only host can end the sessions"})
    }

    //check session already completed
    if(session.status ==- "completed"){
        return res.status(400).json({message:"Session is alresady completed"}); 
    }


    //getting rid of video and chat 
    const call = streamClient.video.call ("default",session.callId)
    await call.delete({hard:true})

    const channel = chatClient.channel("messaging",session.callId)
    await channel.delete();

    session.status = "completed"
    await session.save()

    req.status(200).json({session, message:"Session ended succesfully"})

    }catch(error){
        console.log("Error in endSession controller:",error.message)
        res.status(500).json({message :"Internal Server Error"})
    }
}
