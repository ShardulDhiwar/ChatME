module.exports = (io, socket) => {
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
};
