const express = require('express');
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 80

const io = require('socket.io')(server);

io.on('connection', socket => {

    console.log("New WS Connection...")

    socket.emit()
    socket.broadcast.emit('message','A user has joind the chat')
    io.on('join', joinData = {

    })

    io.on('disconnect', disconnect => {

    })
})
server.listen(port, () => console.log(`Server is listening on port ${port}`))

