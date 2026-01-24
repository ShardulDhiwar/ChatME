module.exports = (io, socket) => {
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
};
