const { activeRooms, userSockets } = require('../../store/userStore');

module.exports = (io, socket) => {
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
};
