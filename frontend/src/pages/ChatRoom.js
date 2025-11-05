import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import './ChatRoom.css';

function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [typingStatus, setTypingStatus] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);

  const messagesEndRef = useRef(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '🎉', '🔥', '✨', '💯', '🚀', '👋', '💬', '📷', '🎵', '⭐'];
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😭', '😢', '🔥', '🎉', '👏'];

  useEffect(() => {
    // Only run if we have roomId AND username is set (after form submission)
    if (!roomId || !username || !isUsernameSet) return;

    console.log('Joining room:', roomId);
    socket.emit('join_room', { roomId, username });

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

    const handleUsersUpdate = (users) => {
      setOnlineUsers(users);
    };

    const handleUserJoined = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'system',
          message: `${data.username} joined the room`,
          timestamp: data.timestamp,
        },
      ]);
    };

    const handleUserLeft = (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: 'system',
          message: `${data.username} left the room`,
          timestamp: data.timestamp,
        },
      ]);
    };

    const handleReactionAdded = (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === data.messageId) {
            const reactions = { ...msg.reactions };
            if (!reactions[data.emoji]) {
              reactions[data.emoji] = [];
            }
            if (!reactions[data.emoji].includes(data.username)) {
              reactions[data.emoji].push(data.username);
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    const handleReactionRemoved = (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (msg.id === data.messageId) {
            const reactions = { ...msg.reactions };
            if (reactions[data.emoji]) {
              reactions[data.emoji] = reactions[data.emoji].filter(
                (user) => user !== data.username
              );
              if (reactions[data.emoji].length === 0) {
                delete reactions[data.emoji];
              }
            }
            return { ...msg, reactions };
          }
          return msg;
        })
      );
    };

    socket.on('chat message', handleMessage);
    socket.on('typing', handleTyping);
    socket.on('users_update', handleUsersUpdate);
    socket.on('user_joined', handleUserJoined);
    socket.on('user_left', handleUserLeft);
    socket.on('reaction_added', handleReactionAdded);
    socket.on('reaction_removed', handleReactionRemoved);

    return () => {
      socket.off('chat message', handleMessage);
      socket.off('typing', handleTyping);
      socket.off('users_update', handleUsersUpdate);
      socket.off('user_joined', handleUserJoined);
      socket.off('user_left', handleUserLeft);
      socket.off('reaction_added', handleReactionAdded);
      socket.off('reaction_removed', handleReactionRemoved);
    };
  }, [roomId, username, isUsernameSet]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && username) {
      const messageData = {
        room: roomId,
        username,
        message,
        timestamp: new Date().toISOString(),
        replyTo: replyingTo,
      };

      console.log('Sending message:', messageData);
      socket.emit('chat message', messageData);
      setMessage('');
      setReplyingTo(null);
      setShowEmojiPicker(false);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([]);
    }
  };

  const exportChat = () => {
    const chatText = messages
      .map((msg) => {
        if (msg.type === 'system') {
          return `[${new Date(msg.timestamp).toLocaleString()}] ${msg.message}`;
        }
        return `[${new Date(msg.timestamp).toLocaleString()}] ${msg.username}: ${msg.message}`;
      })
      .join('\n');

    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${roomId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReply = (msg) => {
    setReplyingTo({
      id: msg.id,
      username: msg.username,
      message: msg.message,
    });
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const handleReaction = (messageId, emoji) => {
    const msg = messages.find((m) => m.id === messageId);
    const hasReacted = msg?.reactions?.[emoji]?.includes(username);

    if (hasReacted) {
      socket.emit('remove_reaction', {
        room: roomId,
        messageId,
        emoji,
        username,
      });
    } else {
      socket.emit('add_reaction', {
        room: roomId,
        messageId,
        emoji,
        username,
      });
    }
    setShowReactionPicker(null);
  };

  const filteredMessages = searchQuery
    ? messages.filter((msg) =>
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : messages;

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
            maxLength={20}
          />
          <button type="submit">Join Chat</button>
        </form>
      </div>
    );
  }

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <div className="header-left">
          <h2>Room: {roomId.slice(0, 8)}...</h2>
          <button className="copy-btn" onClick={copyRoomId} title="Copy Room ID">
            📋
          </button>
          <button
            className="users-btn"
            onClick={() => setShowUsers(!showUsers)}
            title="Online Users"
          >
            👥 {onlineUsers.length}
          </button>
        </div>
        <div className="header-right">
          <button
            className="search-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="Search Messages"
          >
            🔍
          </button>
          <button className="export-btn" onClick={exportChat} title="Export Chat">
            💾
          </button>
          <button className="clear-btn" onClick={clearChat} title="Clear Chat">
            🗑️
          </button>
          <button className="leave-btn" onClick={() => navigate('/')}>
            Leave Room
          </button>
        </div>
      </div>

      {showUsers && (
        <div className="online-users-panel">
          <h3>Online Users ({onlineUsers.length})</h3>
          <ul>
            {onlineUsers.map((user, index) => (
              <li key={index}>
                <span className="online-dot"></span>
                {user}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSearch && (
        <div className="search-panel">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>Clear</button>
          )}
        </div>
      )}

      <div className="messages-container">
        {filteredMessages.length === 0 && searchQuery && (
          <div className="no-results">No messages found</div>
        )}
        {filteredMessages.map((msg, index) => {
          if (msg.type === 'system') {
            return (
              <div key={index} className="system-message">
                {msg.message}
              </div>
            );
          }

          const repliedMsg = msg.replyTo
            ? messages.find((m) => m.id === msg.replyTo.id)
            : null;

          return (
            <div
              key={msg.id || index}
              className={`message ${msg.username === username ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                <strong>{msg.username}</strong>

                {msg.replyTo && (
                  <div className="reply-preview">
                    <span className="reply-icon">↩️</span>
                    <div>
                      <small className="reply-username">{msg.replyTo.username}</small>
                      <p className="reply-text">{msg.replyTo.message}</p>
                    </div>
                  </div>
                )}

                <p>{msg.message}</p>

                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="message-reactions">
                    {Object.entries(msg.reactions).map(([emoji, users]) => (
                      <button
                        key={emoji}
                        className={`reaction-badge ${users.includes(username) ? 'reacted' : ''
                          }`}
                        onClick={() => handleReaction(msg.id, emoji)}
                        title={users.join(', ')}
                      >
                        {emoji} {users.length}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="message-actions">
                <button
                  className="action-btn"
                  onClick={() => handleReply(msg)}
                  title="Reply"
                >
                  ↩️
                </button>
                <button
                  className="action-btn"
                  onClick={() =>
                    setShowReactionPicker(
                      showReactionPicker === msg.id ? null : msg.id
                    )
                  }
                  title="React"
                >
                  😊
                </button>
              </div>

              {showReactionPicker === msg.id && (
                <div className="reaction-picker">
                  {reactionEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className="reaction-emoji-btn"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {typingStatus && (
        <div className="typing-indicator">
          <span className="typing-dots"></span>
          {typingStatus}
        </div>
      )}

      {replyingTo && (
        <div className="reply-banner">
          <div className="reply-content">
            <span className="reply-label">Replying to {replyingTo.username}</span>
            <p>{replyingTo.message}</p>
          </div>
          <button onClick={cancelReply} className="cancel-reply-btn">
            ✕
          </button>
        </div>
      )}

      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => addEmoji(emoji)}
              className="emoji-btn"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-form">
        <button
          type="button"
          className="emoji-toggle-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Add Emoji"
        >
          😊
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            socket.emit('typing', { room: roomId, username });
          }}
          placeholder="Type your message..."
          maxLength={500}
        />
        <span className="char-count">{message.length}/500</span>
        <button type="submit" disabled={!message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatRoom;