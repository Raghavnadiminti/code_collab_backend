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

        socket.on('change', ({ roomname, code, lang }) => {
            socket.broadcast.to(roomname).emit('code', { code, lang });
        });

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
