const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const corsOptions = require('./config/corsOptions');
const initSockets = require('./sockets');
const { getHealth } = require('./controllers/healthController');

const app = express();
const server = http.createServer(app);

// Extensions
app.use(cors(corsOptions));

// Socket.io Setup
const io = new Server(server, {
  cors: corsOptions
});

// Initialize Sockets
initSockets(io);

// Routes
// Health check endpoint
app.get('/health', getHealth);

// Start Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});