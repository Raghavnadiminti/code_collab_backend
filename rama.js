const express= require('express')
const http =require('http')
const app=express() 
const {Server} = require('socket.io')
const cors=require('cors')
const bcrypt=require('bcryptjs')
const {exec} = require('child_process') 
const axios=require('axios')
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
            
            socket.join(roomname)    
            socket.emit('response',{res:true})         
    })

    socket.on('join_room',({username,roomname})=>{
               try{ 
                console.log('joined',roomname)               
                socket.join(roomname)    
                
                socket.emit('response',{res:true})
    }
    catch(err){
        socket.emit('response',{res:false})
    }

    })

    socket.on('change',({roomname,code,lang})=>{
          let room_name=roomname
            console.log(roomname)
        io.to(room_name).emit('code',{code:code,lang:lang})
    })
        
    socket.on('disconnect_',async({roomname,username,role})=>{
             console.log("roomname",username,roomname,role)
            if(role!=0){
                             console.log("okoknoworry")
            }
            else{
                let k=await Editors.findOneAndDelete({room_name:roomname})
                io.to(roomname).emit("close",{res:true})
            }
    })

    socket.on('disconnect', ({roomname,username}) => {
        console.log("disconnected",socket.id)       
      });
      
})


app.get('/checkrooms',async (req,res)=>{
      console.log(req.query)
       let {room_name,roomCode}=req.query
       console.log(room_name,roomCode)
       let k= await Editors.findOne({room_name:room_name,roomCode:roomCode})

       if(k){
        // Editors.findOneAndUpdate({room_name:room_name},{$push:{memebers:username}})
        res.send(k)
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
        let pass = bcrypt.hash(password, salt);
        const newuser= new Users({username:username,password:pass}) 

        newuser.save() 

        res.send(true)

      }
})

app.post('/createroom',async (req,res)=>{
      const {roomname,passCode,lang,username}=req.body 
      console.log(roomname,username)
      let k=await Editors.findOne({room_name:roomname}) 
      if(k){
        res.send(false)
      }
      else{
        const newroom = Editors({room_name:roomname,members:[],language:lang,roomCode:passCode,host:username}) 
        await newroom.save()
        res.send(true) 

      }



})

app.post('/code_run', async (req, res) => {
  const { code, lang } = req.body;
  console.log(lang)

  const langMap = {
    python: 'python3',
    javascript: 'javascript',
    cpp: 'cpp',
   
  };

  const language = langMap[lang];

  if (!language) {
    return res.json({ output: 'Language not supported' });
  }

  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: language,
      version: '*',
      files: [
        {
          name: 'main',
          content: code,
        },
      ],
    });
         console.log(response.data.run.output) 

    res.json({ output: response.data.run.output });
  } catch (error) {
    console.log(error)
    res.json({ output: 'Error executing code' });
  }
});




server.listen(5000,()=>{console.log("server is running")})