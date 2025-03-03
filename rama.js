const express= require('express')
const http =require('http')
const app=express() 
const {Server} = require('socket.io')
const cors=require('cors')
app.use(express.json())
app.use(cors({
    origin:'*',
    methods:['POST','GET'],
    allowedHeaders:['Content-Type'],
    credentials:true
}))



const server=http.createServer(app) 

const io= new Server(server,{cors:{
    origin:'*',
    methods:['POST','GET'],
    allowedHeaders:['Content-Type'],
    credentials:true
}})

// let room_members={}
// let users={}
// let rooms=[]

io.on('connection',(socket)=>{
        console.log('connected',socket.id)
        let room_members={}
        let users={}
        let rooms=[]
    socket.on('create_room',({username,roomname,lang})=>{
             let room_name=roomname

             users[username]=room_name
             room_members[username]=room_name  
             rooms.push(room_name)
             socket.join(roomname) 
             
    })

    socket.on('join_room',({username,roomname})=>{
                let room_name= roomname 
                console.log('joined',room_name,socket.id)
                room_members[username]=room_name 
                socket.join(roomname)            
    })

    socket.on('change',({roomname,code,lang})=>{
          let room_name=roomname
                console.log(lang,room_name,room_members)
        io.to(room_name).emit('code',{code:code,lang:lang})
    })
        

    socket.on('disconnect', () => {
        console.log("disconnected",socket.id) 
        let room_name = room_members[socket.id];
        if (room_name) {
          delete room_members[socket.id];
        }
       
      });
})


app.get('/checkrooms',(req,res)=>{
      
       let {roomname}=req.body 
       let flag=true
       for(let i in rooms){
            if(i==roomname){
                flag=true
            }
       }
       if(flag){
        res.send(true)
       }
       else{
        res.send(false)
       }
})







server.listen(5000,()=>{console.log("server is running")})