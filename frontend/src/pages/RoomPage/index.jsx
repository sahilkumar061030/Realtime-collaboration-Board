import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "./canvas.jsx";

const RoomPage = ({ user, socket, users }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#6366f1");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [lineWidth, setLineWidth] = useState(2);
  const [userNo, setUserNo] = useState(users?.length || 0);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // Professional color palette
  const colorPalette = [
    "#1e293b", "#475569", "#64748b", "#94a3b8",
    "#ef4444", "#f97316", "#f59e0b", "#eab308",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
    "#ec4899", "#f43f5e", "#ffffff", "#000000"
  ];

  const brushSizes = [1, 2, 4, 6, 8, 12, 16, 20];

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      toast.info(data.message);
    };

    const handleUsers = (data) => {
      setUserNo(data.length);
    };

    const handleCanvasCleared = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const context = canvas.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      setElements([]);
      setHistory([]);
      toast.info("Canvas cleared by team member");
    };

    const handleChatMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);
    socket.on("allUsers", handleUsers);
    socket.on("canvasCleared", handleCanvasCleared);
    socket.on("chatMessage", handleChatMessage);

    return () => {
      socket.off("message", handleMessage);
      socket.off("allUsers", handleUsers);
      socket.off("canvasCleared", handleCanvasCleared);
      socket.off("chatMessage", handleChatMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (users) {
      setUserNo(users.length);
    }
  }, [users]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      user: user?.name || "Anonymous",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: socket.id
    };

    socket.emit("sendChatMessage", messageData);
    setNewMessage("");
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
    setHistory([]);
    
    if (socket) {
      socket.emit("clearCanvas");
    }
    
    toast.success("Canvas cleared successfully");
  };

  const undo = () => {
    if (elements.length === 0) return;
    const lastElement = elements[elements.length - 1];
    setHistory((prevHistory) => [...prevHistory, lastElement]);
    setElements((prevElements) => prevElements.slice(0, -1));
  };

  const redo = () => {
    if (history.length === 0) return;
    const lastHistory = history[history.length - 1];
    setElements((prevElements) => [...prevElements, lastHistory]);
    setHistory((prevHistory) => prevHistory.slice(0, -1));
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `canvas-${Date.now()}.png`;
    link.href = url;
    link.click();
    toast.success("Canvas downloaded");
  };

  const tools = [
    { id: "pencil", label: "Pencil", icon: "✏️" },
    { id: "line", label: "Line", icon: "📏" },
    { id: "rect", label: "Rectangle", icon: "▢" },
    { id: "circle", label: "Circle", icon: "◯" },
    { id: "eraser", label: "Eraser", icon: "🧹" }
  ];

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-xl bg-slate-900/50 border-b border-slate-700/50 shadow-2xl flex-shrink-0">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                  Collaborative Workspace
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5 hidden sm:block">Real-time creative collaboration</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-800/50 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-slate-700/50 shadow-lg">
                <div className="relative">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full"></div>
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-500 rounded-full absolute top-0 animate-ping"></div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                  {userNo} Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Top Toolbar */}
      <div className="relative z-10 backdrop-blur-xl bg-slate-800/40 border-b border-slate-700/50 shadow-xl flex-shrink-0">
        <div className="px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center gap-1 sm:gap-2 justify-between">
            
            {/* Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  title={t.label}
                  className={`px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                    tool === t.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50"
                  }`}
                >
                  <span className="block sm:hidden">{t.icon}</span>
                  <span className="hidden sm:block">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>

            {/* Colors */}
            <div className="flex items-center gap-1">
              {colorPalette.slice(0, 8).map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-all ${
                    color === c ? "ring-2 ring-white scale-110" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg cursor-pointer border border-slate-600"
                title="Custom color"
              />
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>

            {/* Brush Sizes */}
            <div className="flex items-center gap-1">
              {brushSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setLineWidth(size)}
                  title={`${size}px`}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all ${
                    lineWidth === size
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-700/30 text-slate-400 hover:bg-slate-700/50"
                  }`}
                >
                  <div 
                    className={`rounded-full ${lineWidth === size ? "bg-white" : "bg-slate-400"}`}
                    style={{ width: `${Math.min(size, 12)}px`, height: `${Math.min(size, 12)}px` }}
                  />
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="hidden sm:block w-px h-8 bg-slate-600"></div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={undo}
                disabled={elements.length === 0}
                title="Undo"
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-500/80 text-white rounded-lg hover:bg-blue-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
              >
                ↶
              </button>
              <button
                onClick={redo}
                disabled={history.length === 0}
                title="Redo"
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-purple-500/80 text-white rounded-lg hover:bg-purple-600 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all text-xs sm:text-sm"
              >
                ↷
              </button>
              <button
                onClick={downloadCanvas}
                title="Download"
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-all text-xs sm:text-sm"
              >
                💾
              </button>
              <button
                onClick={clearCanvas}
                title="Clear Canvas"
                className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-all text-xs sm:text-sm"
              >
                🗑️
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        
        {/* Canvas Area */}
        <div className="flex-1 p-2 sm:p-4 overflow-hidden">
          <div className="h-full backdrop-blur-xl bg-slate-800/40 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <Canvas
              canvasRef={canvasRef}
              ctx={ctx}
              color={color}
              setElements={setElements}
              elements={elements}
              tool={tool}
              socket={socket}
              lineWidth={lineWidth}
            />
          </div>
        </div>

        {/* Chat Sidebar */}
        <aside className="w-80 lg:w-96 backdrop-blur-xl bg-slate-800/40 border-l border-slate-700/50 shadow-2xl flex flex-col overflow-hidden hidden lg:flex">
          
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-6 py-4 border-b border-slate-700/50 flex-shrink-0">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Team Chat
            </h3>
            <p className="text-xs text-slate-400 mt-1">{userNo} members active</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-slate-700/50">
                  <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-slate-300 font-semibold">No messages yet</p>
                <p className="text-sm text-slate-500 mt-1">Start the conversation</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.userId === socket?.id ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-slate-400">
                      {msg.user}
                    </span>
                    <span className="text-xs text-slate-500">{msg.time}</span>
                  </div>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-lg ${
                      msg.userId === socket?.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm"
                        : "bg-slate-700/50 text-slate-200 rounded-bl-sm backdrop-blur-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex-shrink-0">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 bg-slate-700/50 text-white placeholder-slate-400 rounded-xl border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>

        </aside>

      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default RoomPage;