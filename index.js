const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors'); //middleware package to enable cross origin requests 
const { Socket } = require('net');

const  io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Server is running.');
})

//sockets are used for realtime data transmission 
io.on('connection', (socket) => {
    socket.emit('me', socket.id); //it'll simply give us our own id on the front-end side

    socket.on('disconnect', () => {
        socket.broadcast.emit("Call Ended");
    });

    //socket handler call user
    socket.on('calluser', ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit("calluser", {signal: signalData, from, name}); //passing all the data that we'll need on the front-end side
    })

    //socket handler answer call 
    socket.on("answercall", (data) => {
        io.to(data.to).emit("Callaccepted", data.signal);
    })
})

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));