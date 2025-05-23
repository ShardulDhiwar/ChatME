import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket'; // ✅ Import the shared socket instance
import './ChatRoom.css'; // Import the CSS file

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');

  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!roomId) return;

  //   console.log('Joining room:', roomId);
  //   socket.emit('join_room', roomId);

  //   const handleMessage = (data) => {
  //     console.log('Message received:', data);
  //     setMessages((prevMessages) => [...prevMessages, data]);
  //   };

  //   socket.on('chat message', handleMessage);

  //   return () => {
  //     socket.off('chat message', handleMessage); // clean up listener only, not the socket itself
  //   };
  // }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
  
    console.log('Joining room:', roomId);
    socket.emit('join_room', roomId);
  
    const handleMessage = (data) => {
      console.log('Message received:', data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
  
    const handleTyping = (data) => {
      if (data.username !== username) {
        setTypingStatus(`${data.username} is typing...`);
        clearTimeout(window.typingTimeout);
        window.typingTimeout = setTimeout(() => setTypingStatus(''), 1500);
      }
    };
  
    socket.on('chat message', handleMessage);
    socket.on('typing', handleTyping);
  
    return () => {
      socket.off('chat message', handleMessage);
      socket.off('typing', handleTyping);
    };
  }, [roomId, username]);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (message.trim() && username) {
  //     const messageData = {
  //       room: roomId,
  //       username,
  //       message,
  //       timestamp: new Date().toISOString(),
  //     };

  //     console.log('Sending message:', messageData);
  //     socket.emit('chat message', messageData);
  //     setMessages((prevMessages) => [...prevMessages, messageData]);
  //     setMessage('');
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && username) {
      const messageData = {
        room: roomId,
        username,
        message,
        timestamp: new Date().toISOString(),
      };
  
      console.log('Sending message:', messageData);
      socket.emit('chat message', messageData); // ✅ Emit only
      setMessage(''); // ✅ Clear the input
    }
  };
  

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="username-container">
        <h2>Enter your username</h2>
        <form onSubmit={handleUsernameSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <h2>Room: {roomId}</h2>
        <button onClick={() => navigate('/')}>Leave Room</button>
      </div>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.username === username ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              <strong>{msg.username}</strong>
              <p>{msg.message}</p>
            </div>
            <div className="timestamp">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {typingStatus && (
  <div className="typing-indicator" style={{ margin: '10px', fontStyle: 'italic', color: '#888' }}>
    {typingStatus}
  </div>
)}

      <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={message}
        onChange={(e) => {
        setMessage(e.target.value);
        socket.emit('typing', { room: roomId, username });
        }}
        placeholder="Type your message..."
        />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatRoom;
