import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";


const JoinRoomForm = ({uuid,socket,setUser}) => {

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  
  const navigate = useNavigate();
  


  const handleRoomJoin = (e) => {
    e.preventDefault();

   const roomData = {
    name,
    roomId,
    userId: uuid(),
    host: false,
    presenter: false,
   };

   setUser(roomData);
   navigate(`/${roomId}`)
   socket.emit("userJoined", roomData)

  }

 return (
    <form className="w-full max-w-md mx-auto mt-12 bg-gradient-to-br from-white via-cyan-50 to-blue-50 p-10 rounded-3xl shadow-2xl backdrop-blur-lg border-2 border-gradient-to-r from-cyan-200 to-blue-200 relative overflow-hidden group">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-15 animate-bounce delay-700"></div>
        <div className="absolute top-1/2 -right-1 w-6 h-6 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-30 animate-ping delay-500"></div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

      {/* Name Input */}
      <div className="mb-8 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl opacity-0 hover:opacity-10 transition-opacity duration-300 blur-sm"></div>
        <input
          type="text"
          placeholder="🎯 Enter your name"
          className="w-full px-6 py-4 border-2 border-cyan-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:border-cyan-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:shadow-xl hover:scale-105 transform relative z-10 font-medium"
          value={name}
          onChange={(e) => setName(e.target.value)}
          />
      </div>
       
      {/* Room Code Input */}
      <div className="mb-8 flex flex-col sm:flex-row gap-3 relative z-10">
        <div className="flex-grow relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl opacity-0 hover:opacity-10 transition-opacity duration-300 blur-sm"></div>
          <input
            type="text"
            placeholder="🔑 Enter room code"
            className="w-full px-6 py-4 border-2 border-blue-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-300 text-gray-800 placeholder-gray-500 bg-white/90 backdrop-blur-sm hover:shadow-xl hover:scale-105 transform relative z-10 font-mono text-center tracking-widest uppercase"
           value={roomId}
           onChange={(e) => setRoomId(e.target.value)}
                   />
         </div>
       </div>
       
      {/* Join Room Button */}
      <button
        type="submit"
        className="w-full mt-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:from-cyan-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 tracking-wide uppercase relative overflow-hidden group z-10"
        onClick={handleRoomJoin}
                
        >
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <span className="relative z-10 flex items-center justify-center gap-3">
          🎯 Join Room
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </span>
      </button>
    </form>
  );
};

export default JoinRoomForm;