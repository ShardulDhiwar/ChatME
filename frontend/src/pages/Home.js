import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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
    <div className="home-container">
      <h1>Welcome to ChatME</h1>
      <div className="home-buttons">
        <button onClick={createNewRoom} className="create-room-btn">
          Create New Room
        </button>
        <form onSubmit={joinRoom} className="join-room-form">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    </div>
  );
}

export default Home; 