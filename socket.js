const { Editors } = require('./model');

function handleSocketConnections(io) {
    io.on('connection', (socket) => {
        console.log('connected', socket.id);

        socket.on('create_room', async ({ username, roomname, lang, code }) => {
            socket.join(roomname);
            socket.emit('response', { res: true });
        });

        socket.on('join_room', async ({ username, roomname }) => {
            try {
                console.log('joined', roomname);
                socket.join(roomname);
                socket.emit('response', { res: true });
            } catch (err) {
                socket.emit('response', { res: false });
            }
        });

        socket.on('change', ({ roomname, code, lang,user }) => {
            socket.broadcast.to(roomname).emit('code', { code,lang,user});
            console.log("lock",user) 
            socket.broadcast.to(roomname).emit('lock',{username:user})
        });
        socket.on('unlock_',({roomname,username})=>{
            console.log("unlock_",roomname,username) 
            socket.broadcast.to(roomname).emit('unlock',{username:username})
        })

        socket.on('disconnect_', async ({ roomname, username, role }) => {
            if (role === 0) {
                await Editors.findOneAndDelete({ room_name: roomname });
                io.to(roomname).emit('close', { res: true });
            }
        });

        socket.on('disconnect', () => {
            console.log('disconnected', socket.id);
        });
    });
}

module.exports = { handleSocketConnections };
