const registerRoomHandlers = require('./handlers/roomHandler');
const registerMessageHandlers = require('./handlers/messageHandler');
const registerReactionHandlers = require('./handlers/reactionHandler');
const registerDisconnectHandlers = require('./handlers/disconnectHandler');

const initSockets = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Register all handlers
        registerRoomHandlers(io, socket);
        registerMessageHandlers(io, socket);
        registerReactionHandlers(io, socket);
        registerDisconnectHandlers(io, socket);
    });
};

module.exports = initSockets;
