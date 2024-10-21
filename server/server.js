const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
const Message = require('./models/Message');
require('dotenv').config()


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


app.use(cors());
app.use(express.urlencoded({extended:true}))
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);


app.use('/api/chat', chatRoutes);


io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    
    
    Message.find({ room }).then(messages => {
      socket.emit('chatHistory', messages);
    });
  });

  socket.on('chatMessage', async (data) => {
    const message = new Message({
      room: data.room,
      username: data.username,
      message: data.message,
    });
    await message.save();
    
    io.to(data.room).emit('message', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

module.exports = (req, res) => {
  
  server(req, res);  
};

const PORT = process.env.PORT;
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// server.listen(process.env.PORT, () => {
//   console.log(`Server running on port`,process.env.PORT);
// });
