import { io } from 'socket.io-client';

// Automatically detect environment
// Use localhost in development, production URL when deployed
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

const SOCKET_URL = isDevelopment
  ? 'http://localhost:3001'  // Local development
  : 'https://chatme-8jpz.onrender.com';  // Production

console.log('🌐 Connecting to:', SOCKET_URL);

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});

// Debug logging
socket.on('connect', () => {
  console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('🔴 Connection error:', error.message);
});

export default socket;