const { activeRooms, userSockets } = require('../../store/userStore');

module.exports = (io, socket) => {
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
};
