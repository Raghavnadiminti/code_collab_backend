const mongoose=require('mongoose') 
require('dotenv').config();
mongoose.connect(process.env.MONGO_URL) 

const data_scheema=mongoose.Schema({
    room_name:{type:String,required:true},
    members:{type:[String],default:true},
    language:{type:String,default:true},
    roomCode:{type:String,required:true},
    host:{type:String,required:true},
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
      }
    
})

const userScheema=mongoose.Schema({
    username:String,
    password:String
})

const Editors=mongoose.model('room',data_scheema);
const Users=mongoose.model('users',userScheema)


module.exports={Editors,Users}