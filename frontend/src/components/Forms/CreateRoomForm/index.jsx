// const CreateRoomForm = () => {
//     return(
//         <form className="form col-md-12 mt-5">
//             <div className="form-group">
//                 <input type="text" className="form-control my-2" placeholder="enter your name" />
//             </div>
//             <div className="form-group">
//                <div className="input-group">
//                  <input type="text" className="form-control my-2" placeholder="genrate room code" />
//                  <div className="input-group-append">
//                     <button className="btn btn-primary" type="button">genrate</button>
//                      <div className="btn btn-outline-danger btn-sm">copy</div>
//                  </div>
//                </div>
//             </div>
//             <button type="button" className="mt-4 btn-primary btn-block form-control">genrate room</button>
//         </form>
//     )
// };
// export default CreateRoomForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoomForm = ({ uuid, socket, setUser }) => {

 const [roomId, setRoomId] = useState(uuid());
 const [name, setName] = useState("");

 const navigate = useNavigate();

const handleCreateRoom = (e) => {

    e.preventDefault();

    // we need {room, roomId, host, presenter}

    const roomData = {
      name,
      roomId,
      userId: uuid(),
      host: true,
      presenter: true,
    };
 
    setUser(roomData);
    navigate(`${roomId}`);  //It turns the value of roomId into a string.
    console.log(roomData);
    socket.emit("userJoined", roomData); //event emit
   

}


return (
    <div className="w-full max-w-lg mx-auto mt-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-10 rounded-3xl shadow-2xl border-2 border-gradient-to-r from-indigo-200 to-purple-200 backdrop-blur-sm relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 -right-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full opacity-30 animate-bounce delay-500"></div>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-8 text-center tracking-tight">
        Create a New Room
      </h2>

      {/* Name Input */}
      <div className="mb-7 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        <input
          type="text"
          placeholder="✨ Enter your name"
          value={name}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 transition-all duration-300 text-gray-800 placeholder-gray-400 bg-white/80 backdrop-blur-sm hover:shadow-lg hover:scale-105 transform relative z-10"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Room Code Input with Buttons */}
      <div className="mb-7 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow relative">
          <input
            type="text"
            value={roomId}
            disabled
            placeholder="🎲 Generate room code"
            className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 focus:outline-none placeholder-gray-400 font-mono text-center tracking-widest"
          />
        </div>
        
        <button
          type="button"
          className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 font-bold tracking-wide"
          onClick={() => setRoomId(uuid())}
        >
          ⚡ Generate
        </button>
        
        <button
          type="button"
          className="px-6 py-4 border-2 border-rose-400 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-600 rounded-2xl hover:from-rose-100 hover:to-pink-100 hover:border-rose-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 font-bold tracking-wide"
        >
          📋 Copy
        </button>
      </div>

      {/* Generate Room Button */}
      <button
        type="button"
        className="w-full mt-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-5 rounded-2xl font-black text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 tracking-wide uppercase relative overflow-hidden group"
        onClick={handleCreateRoom}
      >
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        <span className="relative z-10 flex items-center justify-center gap-3">
          🚀 Create Room
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </span>
      </button>

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-b-3xl"></div>
    </div>
  );
};

export default CreateRoomForm;
