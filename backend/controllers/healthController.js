const { activeRooms } = require('../store/userStore');

const getHealth = (req, res) => {
    res.status(200).json({ status: 'OK', activeRooms: activeRooms.size });
};

module.exports = { getHealth };
