import mongoose from "mongoose"

const sessionScehema = new mongoose.Schema({
   problem: {
    type:String,
    required: true
   },
   difficulty: {
    type:String ,
    enum:["easy","medium","hard"],
    required:true
   },
   host: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   participant: {
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    //no required, a session can be created without second user
    default:null
   },
   status:{
    type:String,
    enum:["active","completed"],
    default:"active"
   },
   callId: {
    type: String,
    default:""
   }

},
{ timestamps: true }
)

const Session = mongoose.model("Session", sessionScehema);

export default Session