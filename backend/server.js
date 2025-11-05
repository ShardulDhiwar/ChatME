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

// Store active rooms and users
const activeRooms = new Map(); // roomId -> Set of usernames
const userSockets = new Map(); // socketId -> { username, roomId }

// Use environment variable for port (required for Render)
const PORT = process.env.PORT || 3001;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining a room
  socket.on('join_room', (data) => {
    console.log('📥 Join room data received:', data);

    // Handle both {roomId, username} and just roomId string
    const roomId = typeof data === 'string' ? data : data.roomId;
    const username = typeof data === 'string' ? 'Anonymous' : data.username;

    if (!roomId || !username) {
      console.error('❌ Missing roomId or username:', data);
      return;
    }

    socket.join(roomId);

    // Store user info
    userSockets.set(socket.id, { username, roomId });

    // Add user to room
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, new Set());
    }

    // Remove user first if they already exist (prevents duplicates)
    activeRooms.get(roomId).delete(username);
    // Now add them
    activeRooms.get(roomId).add(username);

    console.log(`✅ User ${username} (${socket.id}) joined room: ${roomId}`);
    console.log(`👥 Users in room:`, Array.from(activeRooms.get(roomId)));

    // Notify others in the room that a user joined
    socket.to(roomId).emit('user_joined', {
      username,
      timestamp: new Date().toISOString()
    });

    // Send updated user list to everyone in the room
    const usersInRoom = Array.from(activeRooms.get(roomId));
    io.to(roomId).emit('users_update', usersInRoom);
  });

  // Handle chat messages
  socket.on('chat message', (data) => {
    console.log('Message received:', data);

    // Broadcast to everyone in the room INCLUDING the sender
    io.to(data.room).emit('chat message', {
      id: `${Date.now()}-${Math.random()}`, // Unique message ID
      username: data.username,
      message: data.message,
      timestamp: data.timestamp,
      replyTo: data.replyTo || null,
      reactions: {}
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(data.room).emit('typing', data);
  });

  // Handle message reactions
  socket.on('add_reaction', (data) => {
    const { room, messageId, emoji, username } = data;
    console.log(`Reaction added: ${emoji} by ${username} on message ${messageId}`);

    // Broadcast reaction to everyone in the room
    io.to(room).emit('reaction_added', {
      messageId,
      emoji,
      username,
      timestamp: new Date().toISOString()
    });
  });

  // Handle removing reactions
  socket.on('remove_reaction', (data) => {
    const { room, messageId, emoji, username } = data;
    console.log(`Reaction removed: ${emoji} by ${username} on message ${messageId}`);

    // Broadcast reaction removal to everyone in the room
    io.to(room).emit('reaction_removed', {
      messageId,
      emoji,
      username
    });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const userData = userSockets.get(socket.id);

    if (userData) {
      const { username, roomId } = userData;
      console.log(`❌ User ${username} (${socket.id}) disconnected from room: ${roomId}`);

      // Remove user from room
      if (activeRooms.has(roomId)) {
        activeRooms.get(roomId).delete(username);

        console.log(`👥 Remaining users in room ${roomId}:`, Array.from(activeRooms.get(roomId)));

        // If room is empty, remove it
        if (activeRooms.get(roomId).size === 0) {
          activeRooms.delete(roomId);
          console.log(`🗑️ Room ${roomId} deleted (empty)`);
        } else {
          // Notify others that user left
          socket.to(roomId).emit('user_left', {
            username,
            timestamp: new Date().toISOString()
          });

          // Send updated user list
          const usersInRoom = Array.from(activeRooms.get(roomId));
          io.to(roomId).emit('users_update', usersInRoom);
        }
      }

      userSockets.delete(socket.id);
    } else {
      console.log('❌ User disconnected (no data found):', socket.id);
    }
  });

  // Handle explicit leave room
  socket.on('leave_room', (data) => {
    const { roomId, username } = data;

    socket.leave(roomId);

    if (activeRooms.has(roomId)) {
      activeRooms.get(roomId).delete(username);

      if (activeRooms.get(roomId).size === 0) {
        activeRooms.delete(roomId);
      } else {
        // Notify others
        socket.to(roomId).emit('user_left', {
          username,
          timestamp: new Date().toISOString()
        });

        // Send updated user list
        const usersInRoom = Array.from(activeRooms.get(roomId));
        io.to(roomId).emit('users_update', usersInRoom);
      }
    }

    userSockets.delete(socket.id);
    console.log(`User ${username} explicitly left room: ${roomId}`);
  });
});

// Health check endpoint for deployment platforms
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', activeRooms: activeRooms.size });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});