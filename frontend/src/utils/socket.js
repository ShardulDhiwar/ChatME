// src/utils/socket.js
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001'); // Adjust if using a different server address
// export default socket;

// frontend/src/utils/socket.js
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'https://chatme-8jpz.onrender.com';

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
  upgrade: true,
});

export default socket;

