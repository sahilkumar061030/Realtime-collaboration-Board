import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Chat = ({setOpenedChatTab,socket}) => {

   const [chat, setChat] = useState([]);
   const [message, setMessage] = useState("");

   useEffect(() => {
    socket.on("messageResponce", (data) => {
       setChat((prev) => [...prev, data]);
    });
   },[socket]);
   
   
   
   const handleSubmit = (e) => {
      
    e.preventDefault();
    if(message.trim() !== ""){
      socket.emit("message", {message});
    //    setChat((prev) => [...prev, {message, user: "you"}]);
    }

   }

  return (
        <div className="fixed top-0 left-0 h-full scroll-auto bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 backdrop-blur-xl border-r-4 border-amber-600/50 shadow-2xl z-50 overflow-hidden" style={{ width: "280px" }}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-xl"></div>
          
          <button 
            type="button" 
            onClick={()=> setOpenedChatTab(false)} 
            className="w-32 mt-6 ml-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-2 px-4 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            ✕ Close
          </button>
        
          <div 
          className="w-full scroll-auto mt-8 p-3 px-5 h-100 border border-2 border-amber-50 rounded-4xl overflow-y-auto"
          style = {{height: "50%"}}
          >       
            {
                chat.map((msg, index) => (
                <div key={index*999} className="bg-gradient-to-r from-amber-700/50 to-orange-700/50 backdrop-blur-sm border border-amber-500/30 rounded-xl p-4 mb-3 text-center text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  {msg.name}: {msg.message}
                </div>
                ))
            }
          </div>
          <form onSubmit={handleSubmit} className='w-full mt-8  d-flex  border border-amber-50 rounded-4xl'>
            <input type="text" placeholder='let`s Chat'
             className=' border-0'
             style={{
                    background: "transparent",
                    outline: "0",
                    width: "90%",
                }}
                
                value = {message}
                onChange={(e) =>  setMessage(e.target.value)}
            
            />
            <button
             type="submit"
             className='btn btn-light rounded-0 bg-white'
            >
             Send
            </button>
          </form> 
        </div>
  )
}

export default Chat;
