const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom} = require('./users.js');

const PORT = process.env.PORT || 5000;
const router = require('./router');

const app = express();
const server = http.createServer(app);

corsOptions={
    cors: true,
    origins:["*"]
}
const io = socketio(server, corsOptions);

app.use(cors());


// New connection
io.on('connection', (socket) => {
    console.log('Connected');

    // When user joins room
    socket.on('join', ({name, room}, callback) => {
        const {error, user} = addUser({ id: socket.id, name, room});
        
        if(error) return callback(error);

        socket.emit('message', { user:'adminJoin', text: `${name} has joined!` });
        socket.broadcast.to(user.room).emit('message', {user:'adminJoin', text: `${name} has joined!` });
        socket.join(user.room);


        // Canvas data points emission
        socket.on('canvas-move-backend', (x, y) =>{
            socket.broadcast.to(user.room).emit('canvas-move-frontend', x, y);
        });

        socket.on('canvas-draw-backend', (x, y) =>{
            socket.broadcast.to(user.room).emit('canvas-draw-frontend', x, y);
        });

        // Canvas colour emission

        socket.on('canvas-colour-backend', colour => {
            socket.broadcast.to(user.room).emit('canvas-colour-frontend', colour);
        });

        // Canvas clear emission

        socket.on('canvas-clear-backend', clearCanvas => {
            socket.broadcast.to(user.room).emit('canvas-clear-frontend', clearCanvas);
        });

        //Person drawing on canvas emission

        socket.on('user-drawing-backend', name => {
            io.to(user.room).emit('user-drawing-frontend', name);
        });

        socket.on('canvasOccupied-backend', status => {
            socket.broadcast.to(user.room).emit('canvasOccupied-frontend', status);
        })

        
        const tempUsers = getUsersInRoom(user.room);
        io.to(user.room).emit('usersList', {tempUsers: tempUsers} );

        callback(); 
    });

    socket.on('sendMessage', (message, callback)=>{
    
        const user = getUser(socket.id); 

        io.to(user.room).emit('message', { user: user.name, text:message }); 

        callback();

    });

    socket.on('scale', (scale) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('scale-backend', scale);
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
    
        if(user) {
            io.to(user.room).emit('message', { user: 'adminLeft', text: `${user.name} has left.` });
            const tempUsers = getUsersInRoom(user.room);
            io.to(user.room).emit('usersList', {tempUsers: tempUsers} );
            console.log("Disconnected");
        }
      });
    
});



app.use(router);
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));