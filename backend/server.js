// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// const server = http.createServer(app);

// // Enable CORS for the frontend
// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: ['GET', 'POST']
// }));

// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   }
// });

// // Store active rooms
// const activeRooms = new Set();

// // io.on('connection', (socket) => {
// //   console.log('User connected:', socket.id);

// //   socket.on('join_room', (room) => {
// //     socket.join(room);
// //     activeRooms.add(room);
// //     console.log(`User ${socket.id} joined room: ${room}`);
// //   });

// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   socket.on('join_room', (room) => {
//     socket.join(room);
//     activeRooms.add(room);
    
//     // ✅ Add this log:
//     console.log(`User ${socket.id} joined room: ${room}`);
//   });

//   socket.on('chat message', (data) => {
//     console.log('Message received:', data);
//     // Broadcast to everyone in the room INCLUDING the sender
//     io.to(data.room).emit('chat message', {
//       username: data.username,
//       message: data.message,
//       timestamp: data.timestamp
//     });
//   });

//   socket.on('typing', (data) => {
//     socket.to(data.room).emit('typing', data);
//   });
  

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//   });
// });

// const PORT = 3001;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// }); 

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://chatme.vercel.app", // Replace with your actual Vercel domain
  ],
  methods: ['GET', 'POST']
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// Store active rooms
const activeRooms = new Set();

// Use environment variable for port (required for Render)
const PORT = process.env.PORT || 3001;

// Your existing socket.io logic (keep as is)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (room) => {
    socket.join(room);
    activeRooms.add(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('chat message', (data) => {
    console.log('Message received:', data);
    io.to(data.room).emit('chat message', {
      username: data.username,
      message: data.message,
      timestamp: data.timestamp
    });
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});