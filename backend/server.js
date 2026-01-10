const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");
const { addUser, removeUser, getUsersInRoom, getUser } = require("./utils/users");

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("MERN realtime board sharing app server is running");
});

// Store canvas elements per room
const roomCanvasData = {};

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // User joins room
    socket.on("userJoined", (data) => {
        const { name, userId, roomId, host, presenter } = data;

        socket.join(roomId);
        socket.roomId = roomId;
        socket.userId = userId;

        console.log(`${name} joined room ${roomId}`);

        const usersInRoom = addUser({ ...data, socketId: socket.id });

        if (!roomCanvasData[roomId]) {
            roomCanvasData[roomId] = [];
        }

        socket.emit("userIsJoined", { success: true, users: usersInRoom });
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
        io.to(roomId).emit("allUsers", usersInRoom);

        // Send existing canvas state to new user
        if (roomCanvasData[roomId] && roomCanvasData[roomId].length > 0) {
            socket.emit("canvas-state", roomCanvasData[roomId]);
        }

        console.log(`Canvas state sent to ${name}, ${roomCanvasData[roomId].length} elements`);
    });

    // Handle drawing elements
    socket.on("whiteboardData", (data) => {
        const roomId = socket.roomId;
        if (!roomId) return;

        console.log("Received drawing data from", socket.id, "in room", roomId);

        if (!roomCanvasData[roomId]) {
            roomCanvasData[roomId] = [];
        }
        roomCanvasData[roomId].push(data);

        socket.broadcast.to(roomId).emit("whiteboardData", data);
    });

    // Get canvas state
    socket.on("get-canvas-state", () => {
        const roomId = socket.roomId;
        if (!roomId) return;

        if (roomCanvasData[roomId]) {
            socket.emit("canvas-state", roomCanvasData[roomId]);
        }
    });

    // Clear canvas
    socket.on("clearCanvas", () => {
        const roomId = socket.roomId;
        if (!roomId) return;

        roomCanvasData[roomId] = [];
        io.to(roomId).emit("canvasCleared");
        console.log(`Canvas cleared in room ${roomId}`);
    });

    // Real-time chat - broadcasts message to all users in room
    socket.on("sendChatMessage", (data) => {
        const roomId = socket.roomId;
        if (!roomId) return;

        console.log(`Chat message from ${data.user} in room ${roomId}`);
        
        // Send to everyone in the room including sender
        io.to(roomId).emit("chatMessage", data);
    });

    // Handle messages (legacy)
    socket.on("message", (data) => {
        const { message } = data;
        const user = getUser(socket.id);
        if (user) {
            io.to(socket.roomId).emit("messageResponse", { 
                message, 
                name: user.name 
            });
        }
    });

    // User disconnects
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        const existingUser = getUser(socket.id);
        
        if (existingUser) {
            const removedUser = removeUser(socket.id);
            if (removedUser) {
                socket.broadcast.to(socket.roomId).emit("userleftMessageBroadcasted", removedUser.name);
                
                const usersInRoom = getUsersInRoom(socket.roomId);
                io.to(socket.roomId).emit("allUsers", usersInRoom);

                console.log("Client disconnected:", removedUser.name);

                // Clean up empty rooms
                if (usersInRoom.length === 0 && roomCanvasData[socket.roomId]) {
                    delete roomCanvasData[socket.roomId];
                    console.log(`Room ${socket.roomId} canvas data cleaned up`);
                }
            }
        }
    });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});