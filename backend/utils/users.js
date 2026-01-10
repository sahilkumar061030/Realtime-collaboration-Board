const users = [];

// Add user to room
const addUser = ({ name, userId, roomId, host, presenter, socketId }) => {
    const user = { name, userId, roomId, host, presenter, socketId };
    
    // Check if user already exists
    const existingUser = users.find(u => u.userId === userId && u.roomId === roomId);
    
    if (!existingUser) {
        users.push(user);
    } else {
        // Update socketId if user reconnects
        existingUser.socketId = socketId;
    }
    
    return getUsersInRoom(roomId);
};

// Remove user
const removeUser = (socketId) => {
    const index = users.findIndex(user => user.socketId === socketId);
    
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
    
    return null;
};

// Get user by socketId
const getUser = (socketId) => {
    return users.find(user => user.socketId === socketId);
};

// Get all users in a room
const getUsersInRoom = (roomId) => {
    return users.filter(user => user.roomId === roomId);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};