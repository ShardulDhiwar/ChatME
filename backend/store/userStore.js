// Store active rooms and users
const activeRooms = new Map(); // roomId -> Set of usernames
const userSockets = new Map(); // socketId -> { username, roomId }

module.exports = {
    activeRooms,
    userSockets
};
