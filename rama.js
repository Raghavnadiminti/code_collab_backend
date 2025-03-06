const express= require('express')
const http =require('http')
const app=express() 
const {Server} = require('socket.io')
const cors=require('cors')
const bcrypt=require('bcryptjs')
app.use(express.json())
app.use(cors({
    origin:'*',
    methods:['POST','GET'],
    allowedHeaders:['Content-Type'],
    credentials:true
}))
const {Editors,Users}=require('./model.js')


const server=http.createServer(app) 

const io= new Server(server,{cors:{
    origin:'*',
    methods:['POST','GET'],
    allowedHeaders:['Content-Type'],
    credentials:true
}})



io.on('connection',(socket)=>{
    
        console.log('connected',socket.id)
       
    socket.on('create_room',async ({username,roomname,lang,code})=>{
             const newroom = Editors({room_name:roomname,members:[],language:lang,roomCode:code,host:username}) 
            await newroom.save()
            socket.join(roomname)    
            socket.emit('response',{res:true})         
    })

    socket.on('join_room',({username,roomname})=>{
               try{ let k=Editors.findAndUpdate({room_name:roomname},{$push:{members:username}}) 
                console.log('joined',roomname,socket.id)               
                socket.join(roomname)    
                
                socket.emit('response',{res:true})
    }
    catch(err){
        socket.emit('response',{res:false})
    }

    })

    socket.on('change',({roomname,code,lang})=>{
          let room_name=roomname
                console.log(lang,room_name,room_members)
        io.to(room_name).emit('code',{code:code,lang:lang})
    })
        
    socket.on('disconnect_',async({roomname,username,role})=>{
             
            if(role!=0){
            let k=await Editors.findAndUpdate({room_name:roomname},{$pull:{memebrs:username}})
            }
            else{
                let k=await Editors.findAndDelete({room_name:roomname})
            }
    })

    socket.on('disconnect', ({roomname,username}) => {
        console.log("disconnected",socket.id)       
      });
      
})


app.post('/checkrooms',async (req,res)=>{
      
       let {room_name}=req.body 
       
       let k= await Editors.findOne({room_name:room_name})

       if(k){
        res.send(true)
       }
       else{
        res.send(false)
       }
})

app.post('/login',async (req,res)=>{

    const {username,password}=req.query 

    let k=await Users.findOne({username:username}) 

    if(k){
        console.log(k)
        const isMatch =  bcrypt.compare(password,k.password);
    if (!isMatch) {
       res.send(false);
    }
    else{
        res.send(true)
    }
    }
    else{
        res.send(false)
    }
}
)

app.post('/signup',async (req,res)=>{

      console.log("hiii",req.query)
      const {username,password}=req.query
     
      let k = await Users.findOne({username:username})
      if(k){
        res.send(false)
        console.log("found",k)
      }
      else{
        const salt = await bcrypt.genSalt(10); 
        let pass = await bcrypt.hash(password, salt);
        const newuser= new Users({username:username,password:pass}) 

        newuser.save() 

        res.send(true)

      }
})





server.listen(5000,()=>{console.log("server is running")})