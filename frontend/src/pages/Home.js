import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, LogIn } from 'lucide-react';

function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createNewRoom = () => {
    const newRoomId = uuidv4();
    navigate(`/chat/${newRoomId}`);
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/chat/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500">
      <h1 className="text-white mb-6 text-center font-extrabold tracking-tight drop-shadow-lg text-[clamp(2rem,7vw,3.5rem)] animate-fadeInDown">
        Welcome to ChatME
      </h1>
      <div className="bg-white p-12 rounded-3xl shadow-2xl flex flex-col gap-8 w-full max-w-lg animate-fadeInUp">
        <button
          onClick={createNewRoom}
          className="bg-gradient-to-br from-indigo-500 to-violet-500 text-white border-none py-5 px-8 text-lg font-bold rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl active:translate-y-0 tracking-wide w-full flex items-center justify-center gap-3"
        >
          <PlusCircle size={24} />
          Create New Room
        </button>

        <div className="relative text-center">
          <span className="text-gray-400 font-bold text-sm tracking-widest bg-white px-2">OR</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-10"></div>
        </div>

        <form onSubmit={joinRoom} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="p-5 text-base border-2 border-gray-200 rounded-2xl outline-none transition-all duration-300 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 hover:-translate-y-px w-full"
          />
          <button
            type="submit"
            className="bg-white text-indigo-500 border-2 border-indigo-500 py-5 px-8 text-lg font-bold rounded-2xl cursor-pointer transition-all duration-300 hover:bg-indigo-500 hover:text-white hover:-translate-y-1 hover:shadow-lg active:translate-y-0 tracking-wide w-full flex items-center justify-center gap-3"
          >
            <LogIn size={24} />
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;