import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Forms = ({ uuid, socket, setUser }) => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [showCreatedRoom, setShowCreatedRoom] = useState(false);
  const navigate = useNavigate();

  const handleCopyRoomId = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      toast.success("Room ID copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy Room ID");
    });
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    const newRoomId = uuid();
    const userId = uuid();
    
    setUser(userName);
    setCreatedRoomId(newRoomId);
    setShowCreatedRoom(true);
    
    // Emit join event to server with all required data
    socket.emit("userJoined", { 
      name: userName,
      userId: userId,
      roomId: newRoomId,
      host: true,
      presenter: true
    });
    
    toast.success("Room created successfully!");
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      toast.error("Please enter your name!");
      return;
    }
    
    if (!roomId.trim()) {
      toast.error("Please enter a room ID!");
      return;
    }

    const userId = uuid();
    
    setUser(userName);
    
    // Emit join event to server with all required data
    socket.emit("userJoined", { 
      name: userName,
      userId: userId,
      roomId: roomId.trim(),
      host: false,
      presenter: false
    });
    
    navigate(`/${roomId.trim()}`);
    toast.success("Joined room successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Whiteboard
          </h1>
          <p className="text-gray-600">Collaborate in real-time</p>
        </div>

        {/* Show Created Room ID */}
        {showCreatedRoom && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
            <p className="text-sm font-semibold text-green-700 mb-2">
              🎉 Room Created Successfully!
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={createdRoomId}
                readOnly
                className="flex-1 px-3 py-2 bg-white border border-green-300 rounded text-sm font-mono"
              />
              <button
                onClick={() => handleCopyRoomId(createdRoomId)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm font-semibold whitespace-nowrap"
              >
                📋 Copy
              </button>
            </div>
            <p className="text-xs text-green-600 mt-2">
              Share this ID with others to collaborate!
            </p>
            <button
              onClick={() => navigate(`/${createdRoomId}`)}
              className="w-full mt-3 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors text-sm font-semibold"
            >
              Enter Room →
            </button>
          </div>
        )}

        <div className="space-y-6">
          {/* User Name Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Create Room Section */}
          <div className="border-t pt-6">
            <button
              onClick={handleCreateRoom}
              disabled={showCreatedRoom}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                showCreatedRoom
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-xl transform hover:scale-105"
              }`}
            >
              🎨 Create New Room
            </button>
          </div>

          {/* Join Room Section */}
          <div className="border-t pt-6">
            <p className="text-center text-gray-600 mb-4 text-sm">
              Or join an existing room
            </p>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Paste Room ID here"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              />
              {roomId && (
                <button
                  onClick={() => setRoomId("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleJoinRoom}
              className="w-full bg-white border-2 border-purple-500 text-purple-500 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200"
            >
              🚪 Join Room
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Draw, collaborate, and create together</p>
        </div>
      </div>
    </div>
  );
};

export default Forms;