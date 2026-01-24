import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Send,
  Smile,
  Copy,
  Users,
  Search,
  Download,
  Trash2,
  Reply,
  X,
  ArrowLeft,
  CheckCheck
} from 'lucide-react';
import socket from '../utils/socket';

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

  // Refs for click-outside detection
  const emojiPickerRef = useRef(null);
  const emojiToggleRef = useRef(null);
  const usersPanelRef = useRef(null);
  const usersToggleRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchToggleRef = useRef(null);
  const reactionPickerRef = useRef(null);

  const { roomId } = useParams();
  const navigate = useNavigate();

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '🎉', '🔥', '✨', '💯', '🚀', '👋', '💬', '📷', '🎵', '⭐'];
  const reactionEmojis = ['👍', '❤️', '😂', '😮', '😭', '😢', '🔥', '🎉', '👏'];

  useEffect(() => {
    if (!roomId || !username || !isUsernameSet) return;

    console.log('Joining room:', roomId);
    socket.emit('join_room', { roomId, username });

    const handleMessage = (data) => {
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

  // Click outside to close panels
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiToggleRef.current && !emojiToggleRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
      if (showUsers && usersPanelRef.current && !usersPanelRef.current.contains(event.target) && usersToggleRef.current && !usersToggleRef.current.contains(event.target)) {
        setShowUsers(false);
      }
      if (showSearch && searchPanelRef.current && !searchPanelRef.current.contains(event.target) && searchToggleRef.current && !searchToggleRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (showReactionPicker && reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) {
        setShowReactionPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker, showUsers, showSearch, showReactionPicker]);

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
      socket.emit('chat message', messageData);
      setMessage('');
      setReplyingTo(null);
      setShowEmojiPicker(false);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) setIsUsernameSet(true);
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert('Room ID copied to clipboard!');
  };

  const addEmoji = (emoji) => setMessage((prev) => prev + emoji);

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      setMessages([]);
    }
  };

  const exportChat = () => {
    const chatText = messages.map((msg) => {
      if (msg.type === 'system') return `[${new Date(msg.timestamp).toLocaleString()}] ${msg.message}`;
      return `[${new Date(msg.timestamp).toLocaleString()}] ${msg.username}: ${msg.message}`;
    }).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${roomId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReply = (msg) => {
    setReplyingTo({ id: msg.id, username: msg.username, message: msg.message });
  };

  const cancelReply = () => setReplyingTo(null);

  const handleReaction = (messageId, emoji) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg) return;
    const reactions = msg.reactions || {};
    const hasReacted = reactions[emoji]?.includes(username);
    if (hasReacted) {
      socket.emit('remove_reaction', { room: roomId, messageId, emoji, username });
    } else {
      socket.emit('add_reaction', { room: roomId, messageId, emoji, username });
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#6a5af9] via-[#865cf6] to-[#d946ef] p-6 lg:p-12">
        <h2 className="text-white text-4xl mb-12 drop-shadow-xl animate-fadeInDown font-black tracking-tighter text-center">
          ChatME
        </h2>
        <form onSubmit={handleUsernameSubmit} className="bg-white p-10 rounded-[40px] shadow-2xl flex flex-col gap-8 w-full max-w-md animate-fadeInUp">
          <div className="space-y-2">
            <label className="text-gray-500 font-bold text-sm ml-2">WHO ARE YOU?</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username..."
              maxLength={20}
              className="w-full p-6 text-lg border-none bg-gray-50 rounded-[28px] outline-none transition-all duration-300 font-medium focus:ring-4 focus:ring-indigo-500/10 placeholder-gray-300"
            />
          </div>
          <button type="submit" className="bg-[#6a5af9] text-white py-6 px-10 text-xl font-bold rounded-[30px] cursor-pointer transition-all duration-300 shadow-xl hover:scale-[1.02] active:scale-[0.98] tracking-wide">
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-full mx-auto bg-[#f6f6f9] border-6 border-[#00000] rounded-2xl overflow-hidden md:max-w-2xl md:shadow-2xl">
      {/* Refined Header Design */}
      <div className="bg-white px-6 py-4 flex justify-between items-center shadow-sm z-30 transition-all duration-300 rounded-b-[40px]">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100 flex-shrink-0" title="Leave Room">
            <ArrowLeft size={24} />
          </button>
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6a5af9] to-[#d946ef] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-gray-800 text-lg font-bold leading-tight truncate">Room: {roomId.slice(0, 8)}</h2>
              <button onClick={copyRoomId} className="text-gray-300 hover:text-indigo-500 transition-colors" title="Copy Room ID">
                <Copy size={14} />
              </button>
            </div>
            <span className="text-emerald-500 text-xs font-semibold uppercase tracking-widest">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            ref={searchToggleRef}
            className={`p-2 rounded-full transition-all ${showSearch ? 'bg-indigo-50 text-indigo-500' : 'text-gray-400 hover:bg-gray-100'}`}
            onClick={() => setShowSearch(!showSearch)}
            title="Search Messages"
          >
            <Search size={22} />
          </button>
          <button
            ref={usersToggleRef}
            className={`p-2 rounded-full transition-all flex items-center gap-1.5 ${showUsers ? 'bg-indigo-50 text-indigo-500' : 'text-gray-400 hover:bg-gray-100'}`}
            onClick={() => setShowUsers(!showUsers)}
            title="Online Users"
          >
            <Users size={22} />
            <span className="text-xs font-bold">{onlineUsers.length}</span>
          </button>
          <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block"></div>
          <button onClick={exportChat} className="text-gray-400 hover:text-indigo-500 transition-all p-2 rounded-full hover:bg-indigo-50 hidden sm:block" title="Export Chat">
            <Download size={22} />
          </button>
          <button onClick={clearChat} className="text-gray-400 hover:text-rose-500 transition-all p-2 rounded-full hover:bg-rose-50 hidden sm:block" title="Clear Chat">
            <Trash2 size={22} />
          </button>
        </div>
      </div>

      {/* Slide-down UI Panels */}
      {showUsers && (
        <div ref={usersPanelRef} className="bg-white m-4 mt-2 p-6 rounded-[30px] shadow-xl border border-gray-100 animate-slideDown z-20 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-indigo-500 font-bold text-lg uppercase tracking-tight">Active Members</h3>
            <span className="bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full text-xs font-black">{onlineUsers.length}</span>
          </div>
          <ul className="flex flex-wrap gap-3">
            {onlineUsers.map((user, index) => (
              <li key={index} className="flex items-center gap-2 p-2 px-4 bg-gray-50 rounded-2xl text-[13px] font-bold text-gray-600 border border-transparent hover:border-indigo-100 transition-all cursor-default">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                {user}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSearch && (
        <div ref={searchPanelRef} className="bg-white m-4 mt-2 p-4 rounded-full shadow-xl border border-gray-100 flex gap-3 animate-slideDown z-20">
          <input
            type="text"
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 bg-transparent text-sm outline-none font-medium placeholder-gray-300"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-all"><X size={16} /></button>
          )}
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 bg-[#f6f6f9] scroll-smooth">
        {filteredMessages.length === 0 && searchQuery && (
          <div className="flex flex-col items-center justify-center p-20 opacity-30">
            <Search size={48} className="mb-4" />
            <span className="font-bold italic">No results found</span>
          </div>
        )}

        {filteredMessages.map((msg, index) => {
          if (msg.type === 'system') {
            return (
              <div key={index} className="text-center my-4 animate-fadeIn">
                <span className="bg-gray-200/50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  {msg.message}
                </span>
              </div>
            );
          }

          const isMe = msg.username === username;

          return (
            <div key={msg.id || index} className={`group flex flex-col mb-4 animate-slideIn ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`flex items-center gap-3 max-w-[90%] md:max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="relative max-w-full">
                  {/* Reaction Picker Popup - Now anchored relative to bubble */}
                  {showReactionPicker === msg.id && (
                    <div ref={reactionPickerRef} className={`absolute z-50 bg-white/95 backdrop-blur-xl rounded-[28px] p-2 shadow-2xl flex gap-1 animate-slideUp border border-white/50 -top-14 ${isMe ? 'right-0' : 'left-0'
                      }`}>
                      {reactionEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReaction(msg.id, emoji)}
                          className="w-9 h-9 flex items-center justify-center text-lg hover:bg-gray-50 rounded-full transition-all hover:scale-[1.25]"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`p-4 px-6 shadow-sm break-words relative transition-all duration-300 ${isMe
                      ? 'bg-[#6a5af9] text-white rounded-[26px] rounded-tr-[4px] shadow-indigo-200'
                      : 'bg-white text-gray-800 rounded-[26px] rounded-tl-[4px] shadow-gray-200 border border-white'
                    }`}>
                    {/* Compact Reply Preview */}
                    {msg.replyTo && (
                      <div className={`mb-3 p-3 rounded-[16px] border-l-4 text-[11px] leading-snug animate-fadeIn transition-all ${isMe ? 'bg-white/10 border-white/40 text-white/90' : 'bg-indigo-50/50 border-indigo-500 text-gray-500'
                        }`}>
                        <div className="font-bold opacity-80 mb-1 flex items-center gap-1">
                          <Reply size={10} /> {msg.replyTo.username}
                        </div>
                        <div className="truncate opacity-70 italic">"{msg.replyTo.message}"</div>
                      </div>
                    )}

                    {!isMe && (
                      <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-2 leading-none">{msg.username}</span>
                    )}

                    <p className="text-[15px] leading-relaxed font-medium">{msg.message}</p>

                    {/* Reaction Badges */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className={`flex flex-wrap gap-1.5 absolute -bottom-3 ${isMe ? 'right-0' : 'left-0'}`}>
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            className={`flex items-center gap-1 border-2 px-2 py-0.5 rounded-full text-[11px] font-bold transition-all hover:scale-110 ${users.includes(username)
                                ? 'bg-[#6a5af9] text-white border-[#6a5af9]'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-indigo-100'
                              }`}
                            onClick={() => handleReaction(msg.id, emoji)}
                          >
                            {emoji} {users.length}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Side Actions (Reply/React next to bubble) */}
                <div className={`flex flex-col gap-1.5 transition-all duration-300 opacity-0 group-hover:opacity-100 group-active:opacity-100 flex-shrink-0`}>
                  <button
                    onClick={() => handleReply(msg)}
                    className="p-2.5 bg-white text-gray-400 hover:text-indigo-500 rounded-full shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Reply"
                  >
                    <Reply size={16} />
                  </button>
                  <button
                    onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                    className="p-2.5 bg-white text-gray-400 hover:text-indigo-500 rounded-full shadow-md transition-all hover:scale-110 active:scale-95"
                    title="React"
                  >
                    <Smile size={16} />
                  </button>
                </div>
              </div>

              {/* Time and Status Label */}
              <div className={`mt-2 flex items-center gap-1.5 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-bold text-gray-300 tabular-nums lowercase">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isMe && <CheckCheck size={14} className="text-[#6a5af9] opacity-80" />}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingStatus && (
        <div className="bg-white/80 backdrop-blur px-6 py-2 border-t border-gray-50 flex items-center gap-3 animate-fadeIn">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
          </div>
          <span className="text-[11px] font-bold text-indigo-500/60 uppercase tracking-tighter italic">{typingStatus}</span>
        </div>
      )}

      {/* Input Area Group */}
      <div className="bg-white pt-2 pb-8 px-6 transition-all duration-300 rounded-t-[40px] shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)]">
        {/* Reply Preview Banner */}
        {replyingTo && (
          <div className="mb-4 bg-gray-50 p-4 rounded-[24px] flex justify-between items-center border border-gray-100 animate-slideDown">
            <div className="flex-1 pr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#6a5af9]">Replying to {replyingTo.username}</span>
              <p className="text-xs text-gray-400 truncate mt-1">{replyingTo.message}</p>
            </div>
            <button onClick={cancelReply} className="w-8 h-8 flex items-center justify-center bg-white text-rose-500 rounded-full shadow-sm hover:bg-rose-50 transition-all">
              <X size={14} />
            </button>
          </div>
        )}

        {/* Small Emoji Picker Popup */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[280px] bg-white rounded-[32px] p-4 shadow-2xl grid grid-cols-5 gap-3 animate-slideUp z-50 border border-gray-100">
            {emojis.map((emoji, index) => (
              <button key={index} onClick={() => addEmoji(emoji)} className="w-10 h-10 flex items-center justify-center text-xl hover:bg-indigo-50 rounded-xl transition-all hover:scale-125">
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Pill Input Design */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 relative">
          <div className="flex-1 bg-[#f0f2f7] rounded-[35px] flex items-center px-6 py-4 transition-all focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 focus-within:shadow-indigo-50">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit('typing', { room: roomId, username });
              }}
              placeholder="Type here..."
              maxLength={500}
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-medium placeholder-gray-400"
            />

            <div className="flex items-center gap-2 pl-3 border-l border-gray-200 ml-2">
              <button
                ref={emojiToggleRef}
                type="button"
                className="text-gray-400 hover:text-indigo-500 transition-colors"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={24} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!message.trim()}
            className="w-[60px] h-[60px] bg-[#6a5af9] text-white flex items-center justify-center rounded-full shadow-lg shadow-indigo-100 enabled:hover:scale-110 enabled:active:scale-95 disabled:opacity-30 disabled:grayscale transition-all"
          >
            <Send size={24} className="ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;