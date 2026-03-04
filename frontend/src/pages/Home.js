import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { PlusCircle, LogIn } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');

  * { box-sizing: border-box; }

  .nb-root {
    font-family: 'Space Mono', monospace;
    background-color: #f5f0e8;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      #d4c9b0 39px,
      #d4c9b0 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 39px,
      #d4c9b0 39px,
      #d4c9b0 40px
    );
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  .nb-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.5rem, 18vw, 7rem);
    letter-spacing: 0.05em;
    color: #ff3c00;
    line-height: 1;
    margin: 0 0 8px 0;
    text-shadow: 6px 6px 0px #ffd000;
    text-align: center;
  }

  .nb-subtitle {
    font-family: 'Space Mono', monospace;
    font-size: clamp(0.6rem, 2.5vw, 0.75rem);
    font-weight: 700;
    letter-spacing: 0.3em;
    color: #111;
    border: 2px solid #111;
    padding: 4px 12px;
    margin: 0 0 28px 0;
    background: #ffd000;
    text-transform: uppercase;
    text-align: center;
  }

  .nb-card {
    background: #f5f0e8;
    border: 3px solid #111;
    box-shadow: 8px 8px 0px #111;
    padding: 24px 20px;
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  @media (min-width: 480px) {
    .nb-card { padding: 40px 36px; }
    .nb-subtitle { margin-bottom: 36px; }
  }

  .nb-btn-primary {
    background: #ff3c00;
    color: #fff;
    border: 3px solid #111;
    box-shadow: 5px 5px 0px #111;
    padding: 16px 20px;
    font-family: 'Space Mono', monospace;
    font-size: clamp(0.78rem, 3vw, 0.95rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.1s, box-shadow 0.1s;
    width: 100%;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .nb-btn-primary:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0px #111; }
  .nb-btn-primary:active { transform: translate(3px, 3px); box-shadow: 2px 2px 0px #111; }

  .nb-divider {
    display: flex;
    align-items: center;
    margin: 22px 0;
  }

  .nb-divider-line { flex: 1; height: 3px; background: #111; }

  .nb-divider-text {
    background: #ffd000;
    border: 3px solid #111;
    padding: 2px 10px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #111;
  }

  .nb-input-label {
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #111;
    margin-bottom: 8px;
    display: block;
  }

  .nb-input {
    width: 100%;
    padding: 14px 16px;
    font-family: 'Space Mono', monospace;
    font-size: 16px; /* 16px prevents iOS auto-zoom on focus */
    font-weight: 700;
    border: 3px solid #111;
    background: #fff;
    outline: none;
    transition: box-shadow 0.1s;
    -webkit-tap-highlight-color: transparent;
  }

  .nb-input:focus { box-shadow: 4px 4px 0px #111; }
  .nb-input::placeholder { color: #bbb; font-weight: 400; }

  .nb-btn-secondary {
    background: #ffd000;
    color: #111;
    border: 3px solid #111;
    box-shadow: 5px 5px 0px #111;
    padding: 16px 20px;
    font-family: 'Space Mono', monospace;
    font-size: clamp(0.78rem, 3vw, 0.95rem);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: transform 0.1s, box-shadow 0.1s;
    width: 100%;
    margin-top: 12px;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .nb-btn-secondary:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0px #111; }
  .nb-btn-secondary:active { transform: translate(3px, 3px); box-shadow: 2px 2px 0px #111; }

  .nb-corner-tag {
    position: fixed;
    bottom: 14px;
    right: 14px;
    background: #111;
    color: #ffd000;
    font-family: 'Space Mono', monospace;
    font-size: 0.52rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    padding: 5px 8px;
    text-transform: uppercase;
    /* hide on very small screens so it doesn't overlap content */
  }

  @media (max-width: 360px) {
    .nb-corner-tag { display: none; }
    .nb-title { font-size: 3rem; }
  }
`;

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
    <>
      <style>{styles}</style>
      <div className="nb-root">
        <h1 className="nb-title">ChatME</h1>
        <div className="nb-subtitle">{'// Real-time messaging'}</div>

        <div className="nb-card">
          <button onClick={createNewRoom} className="nb-btn-primary">
            <PlusCircle size={20} />
            Create New Room
          </button>

          <div className="nb-divider">
            <div className="nb-divider-line" />
            <div className="nb-divider-text">OR</div>
            <div className="nb-divider-line" />
          </div>

          <form onSubmit={joinRoom} style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="nb-input-label">Enter Room ID</label>
            <input
              type="text"
              placeholder="paste-your-room-id-here"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="nb-input"
            />
            <button type="submit" className="nb-btn-secondary">
              <LogIn size={20} />
              Join Room
            </button>
          </form>
        </div>

        <div className="nb-corner-tag">v1.0 // brutalist</div>
      </div>
    </>
  );
}

export default Home;