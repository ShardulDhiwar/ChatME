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

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');

    * { box-sizing: border-box; }

    .nb-chat-outer {
      width: 100%;
      height: 100vh;
      height: 100dvh;
      background: #e8e3db;
      display: flex;
      justify-content: center;
      align-items: stretch;
    }

    .nb-chat-root {
      font-family: 'Space Mono', monospace;
      display: flex;
      flex-direction: column;
      height: 100vh;
      height: 100dvh;
      width: 80%;
      max-width: 100%;
      background: #f5f0e8;
      box-shadow: 0 0 0 1px #ccc;
    }

    /* ── Username screen ── */
    .nb-username-screen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: #f5f0e8;
      background-image: repeating-linear-gradient(0deg,transparent,transparent 39px,#d4c9b0 39px,#d4c9b0 40px),
        repeating-linear-gradient(90deg,transparent,transparent 39px,#d4c9b0 39px,#d4c9b0 40px);
      padding: 32px 20px;
    }

    .nb-login-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(4.5rem, 20vw, 6rem);
      color: #ff3c00;
      text-shadow: 5px 5px 0 #ffd000;
      margin-bottom: 28px;
      letter-spacing: 0.05em;
      text-align: center;
    }

    .nb-login-card {
      background: #f5f0e8;
      border: 3px solid #111;
      box-shadow: 8px 8px 0 #111;
      padding: 32px 24px;
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .nb-login-label {
      font-size: clamp(0.65rem, 3vw, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #111;
      margin-bottom: 6px;
      display: block;
    }

    .nb-login-input {
      width: 100%;
      padding: 18px 16px;
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      border: 3px solid #111;
      background: #fff;
      outline: none;
      transition: box-shadow 0.1s;
      -webkit-tap-highlight-color: transparent;
    }

    .nb-login-input:focus { box-shadow: 4px 4px 0 #111; }
    .nb-login-input::placeholder { color: #bbb; font-weight: 400; }

    .nb-login-btn {
      background: #bbff00;
      color: #111;
      border: 3px solid #111;
      box-shadow: 5px 5px 0 #111;
      padding: 20px;
      font-family: 'Space Mono', monospace;
      font-size: clamp(0.9rem, 4vw, 1.05rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .nb-login-btn:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 #111; }
    .nb-login-btn:active { transform: translate(3px,3px); box-shadow: 2px 2px 0 #111; }

    /* ── Header ── */
    .nb-header {
      background: #111;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      z-index: 30;
    }

    .nb-header-left { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }

    .nb-back-btn {
      background: transparent;
      border: 2px solid #ffd000;
      color: #ffd000;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-back-btn:hover { background: #ffd000; color: #111; }

    .nb-avatar {
      width: 44px;
      height: 44px;
      background: #ff3c00;
      border: 2px solid #ffd000;
      color: #fff;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }

    .nb-online-dot {
      position: absolute;
      bottom: -3px;
      right: -3px;
      width: 11px;
      height: 11px;
      background: #00e676;
      border: 2px solid #111;
    }

    .nb-room-info { display: flex; flex-direction: column; min-width: 0; }

    .nb-room-name {
      color: #fff;
      font-size: clamp(0.8rem, 3.5vw, 1rem);
      font-weight: 700;
      letter-spacing: 0.05em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .nb-copy-btn {
      background: transparent;
      border: none;
      color: #ffd000;
      cursor: pointer;
      padding: 2px;
      display: flex;
      flex-shrink: 0;
      touch-action: manipulation;
    }
    .nb-copy-btn:hover { color: #fff; }

    .nb-online-label {
      color: #00e676;
      font-size: clamp(0.55rem, 2.2vw, 0.65rem);
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
    }

    .nb-header-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }

    .nb-icon-btn {
      background: transparent;
      border: 2px solid transparent;
      color: #aaa;
      padding: 9px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      font-family: 'Space Mono', monospace;
      font-size: clamp(0.65rem, 2.5vw, 0.75rem);
      font-weight: 700;
      transition: all 0.1s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-icon-btn:hover { color: #bbff00; border-color: #bbff00; }
    .nb-icon-btn.user:hover { color: #ffd000; border-color: #ffd000; }
    .nb-icon-btn.download:hover { color:#00aaff; border-color: #00aaff; }
    .nb-icon-btn.active { background: #ffd000; color: #111; border-color: #ffd000; }
    .nb-icon-btn.danger:hover { color: #ff3c00; border-color: #ff3c00; }

    /* ── Panels ── */
    .nb-panel {
      background: #fff;
      border-bottom: 3px solid #111;
      padding: 18px 20px;
      animation: slideDown 0.15s ease;
      z-index: 20;
    }

    .nb-panel-title {
      font-size: clamp(0.65rem, 2.8vw, 0.75rem);
      font-weight: 700;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #111;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nb-badge {
      background: #ffd000;
      color: #111;
      border: 2px solid #111;
      padding: 2px 10px;
      font-size: clamp(0.65rem, 2.5vw, 0.75rem);
      font-weight: 700;
    }

    .nb-users-list { display: flex; flex-wrap: wrap; gap: 8px; }

    .nb-user-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #f5f0e8;
      border: 2px solid #111;
      padding: 8px 14px;
      font-size: clamp(0.75rem, 3vw, 0.85rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nb-user-dot { width: 9px; height: 9px; background: #00e676; border: 1px solid #111; flex-shrink: 0; }

    .nb-search-input {
      width: 100%;
      padding: 14px 16px;
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      border: 2px solid #111;
      background: #f5f0e8;
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-search-input:focus { background: #fff; }
    .nb-search-input::placeholder { color: #bbb; font-weight: 400; }

    /* ── Messages ── */
    .nb-messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 22px;
      background-color: #f5f0e8;
      background-image: repeating-linear-gradient(0deg,transparent,transparent 39px,#e0d8c8 39px,#e0d8c8 40px);
      -webkit-overflow-scrolling: touch;
    }

    @media (min-width: 769px) {
      .nb-messages { padding: 28px 40px; }
    }

    .nb-system-msg {
      text-align: center;
      display: flex;
      justify-content: center;
    }
    .nb-system-tag {
      background: #111;
      color: #ffd000;
      font-size: clamp(0.6rem, 2.5vw, 0.7rem);
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 4px 14px;
    }

    .nb-msg-row {
      display: flex;
      flex-direction: column;
      gap: 5px;
      animation: fadeInMsg 0.2s ease;
    }
    .nb-msg-row.me { align-items: flex-end; }
    .nb-msg-row.them { align-items: flex-start; }

    .nb-msg-inner {
      display: flex;
      align-items: flex-end;
      gap: 10px;
      max-width: 85%;
    }

    @media (min-width: 769px) {
      .nb-msg-inner { max-width: min(60%, 700px); }
    }

    .nb-msg-row.me .nb-msg-inner { flex-direction: row-reverse; }

    .nb-bubble-wrap { position: relative; max-width: 100%; }

    .nb-bubble {
      padding: 14px 18px;
      border: 3px solid #111;
      font-size: clamp(0.95rem, 4vw, 1rem);
      font-weight: 400;
      line-height: 1.6;
      word-break: break-word;
      position: relative;
    }
    .nb-bubble.me { background: #bbff00 ; color: #111; box-shadow: 4px 4px 0 #111; }
    .nb-bubble.them { background: #ffd000; color: #111; box-shadow: 4px 4px 0 #111; }

    .nb-sender-name {
      font-size: clamp(0.65rem, 2.8vw, 0.72rem);
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #111;
      margin-bottom: 6px;
    }

    .nb-reply-preview {
      border-left: 4px solid;
      padding: 6px 10px;
      margin-bottom: 10px;
      background: #f0f0f0;
      font-size: clamp(0.75rem, 3vw, 0.82rem);
    }
    .nb-bubble.me .nb-reply-preview { border-color: #ffbb00; background: fff8e1; color: 555; }
    .nb-bubble.them .nb-reply-preview { border-color: #bbff00; background: #fff8e1; color: #555; }

    .nb-reply-who { font-weight: 700; font-size: clamp(0.65rem, 2.8vw, 0.72rem); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 2px; display: flex; align-items: center; gap: 4px; }
    .nb-reply-text { font-style: italic; opacity: 0.7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .nb-reactions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      position: absolute;
      bottom: -16px;
    }
    .nb-msg-row.me .nb-reactions { right: 0; }
    .nb-msg-row.them .nb-reactions { left: 0; }

    .nb-reaction-badge {
      background: #f5f0e8;
      color: #111;
      border: 2px solid #111;
      padding: 2px 8px;
      font-size: clamp(0.72rem, 3vw, 0.8rem);
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 3px;
      transition: transform 0.1s;
      touch-action: manipulation;
    }
    .nb-reaction-badge:hover { transform: scale(1.1); }
    .nb-reaction-badge.mine { background: #ffd000; }

    .nb-reaction-picker {
      position: absolute;
      z-index: 50;
      background: #fff;
      border: 3px solid #111;
      box-shadow: 5px 5px 0 #111;
      padding: 10px;
      display: flex;
      gap: 4px;
      top: -58px;
      animation: slideUp 0.15s ease;
    }
    .nb-msg-row.me .nb-reaction-picker { right: 0; }
    .nb-msg-row.them .nb-reaction-picker { left: 0; }

    .nb-emoji-btn-sm {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      background: transparent;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.1s;
      touch-action: manipulation;
    }
    .nb-emoji-btn-sm:hover { background: #f5f0e8; border-color: #111; transform: scale(1.2); }

    /* Always show side actions on mobile (no hover) */
    .nb-side-actions {
      display: flex;
      flex-direction: column;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.15s;
      flex-shrink: 0;
    }
    .nb-msg-row:hover .nb-side-actions { opacity: 1; }

    @media (max-width: 768px) {
      .nb-side-actions { opacity: 1; }
    }

    .nb-action-btn {
      background: #fff;
      border: 2px solid #111;
      color: #111;
      width: 34px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.1s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-action-btn:hover { background: #ffd000; }

    .nb-meta {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 4px;
      font-size: clamp(0.65rem, 2.5vw, 0.72rem);
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #aaa;
    }
    .nb-msg-row.me .nb-meta { flex-direction: row-reverse; }

    /* ── Typing ── */
    .nb-typing {
      background: #111;
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      animation: fadeInMsg 0.2s ease;
      flex-shrink: 0;
    }

    .nb-typing-dots { display: flex; gap: 5px; }
    .nb-typing-dot {
      width: 7px;
      height: 7px;
      background: #ffd000;
      animation: bounce 0.8s infinite;
    }
    .nb-typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .nb-typing-dot:nth-child(3) { animation-delay: 0.3s; }
    .nb-typing-text { color: #ffd000; font-size: clamp(0.65rem, 2.8vw, 0.72rem); font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; }

    /* ── Input area ── */
    .nb-input-area {
      background: #fff;
      border-top: 3px solid #111;
      padding: 14px 16px 18px;
      flex-shrink: 0;
    }

    @media (min-width: 769px) {
      .nb-input-area { padding: 16px 24px 20px; }
    }

    .nb-reply-banner {
      background: #ffd000;
      border: 2px solid #111;
      padding: 10px 14px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideDown 0.15s ease;
    }

    .nb-reply-label { font-size: clamp(0.62rem, 2.5vw, 0.7rem); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #111; }
    .nb-reply-quote { font-size: clamp(0.78rem, 3.2vw, 0.85rem); color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }

    .nb-cancel-reply {
      background: #111;
      border: none;
      color: #ffd000;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      margin-left: 12px;
      transition: background 0.1s;
      touch-action: manipulation;
    }
    .nb-cancel-reply:hover { background: #ff3c00; }

    .nb-emoji-picker-popup {
      background: #fff;
      border: 3px solid #111;
      box-shadow: 6px 6px 0 #111;
      padding: 12px;
      position: absolute;
      bottom: 90px;
      left: 16px;
      right: 16px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px;
      z-index: 50;
      animation: slideUp 0.15s ease;
    }

    @media (min-width: 480px) {
      .nb-emoji-picker-popup {
        left: 20px;
        right: auto;
        width: 240px;
      }
    }

    .nb-emoji-btn {
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: clamp(1.2rem, 5vw, 1.4rem);
      background: transparent;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.1s;
      touch-action: manipulation;
    }
    .nb-emoji-btn:hover { background: #f5f0e8; border-color: #111; }

    .nb-input-row {
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;
    }

    .nb-input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      border: 3px solid #111;
      background: #f5f0e8;
      transition: background 0.1s, box-shadow 0.1s;
    }
    .nb-input-wrap:focus-within { background: #fff; box-shadow: 4px 4px 0 #111; }

    .nb-text-input {
      flex: 1;
      padding: 16px;
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      font-weight: 700;
      border: none;
      background: transparent;
      outline: none;
      color: #111;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-text-input::placeholder { color: #bbb; font-weight: 400; }

    .nb-emoji-toggle {
      background: transparent;
      border: none;
      color: #888;
      padding: 10px 14px;
      cursor: pointer;
      display: flex;
      border-left: 2px solid #ddd;
      transition: color 0.1s;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-emoji-toggle:hover { color: #ff3c00; }

    .nb-send-btn {
      background: #bbff00;
      border: 3px solid #111;
      box-shadow: 4px 4px 0 #111;
      color: #fff;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.1s, box-shadow 0.1s;
      flex-shrink: 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    .nb-send-btn:hover:not(:disabled) { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #111; }
    .nb-send-btn:active:not(:disabled) { transform: translate(2px,2px); box-shadow: 2px 2px 0 #111; }
    .nb-send-btn:disabled { background: #ccc; opacity: 0.5; cursor: not-allowed; box-shadow: 2px 2px 0 #888; }

    /* ── Empty state ── */
    .nb-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; opacity: 0.35; }
    .nb-empty-icon { font-size: 3rem; margin-bottom: 10px; }
    .nb-empty-text { font-size: clamp(0.75rem, 3vw, 0.85rem); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; }

    /* ── Keyframes ── */
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-5px); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeInMsg {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;

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
      socket.emit('join_room', { roomId, username });

      const handleMessage = (data) => setMessages((prev) => [...prev, data]);
      const handleTyping = (data) => {
        if (data.username !== username) {
          setTypingStatus(`${data.username} is typing...`);
          clearTimeout(window.typingTimeout);
          window.typingTimeout = setTimeout(() => setTypingStatus(''), 1500);
        }
      };
      const handleUsersUpdate = (users) => setOnlineUsers(users);
      const handleUserJoined = (data) => setMessages((prev) => [...prev, { type: 'system', message: `${data.username} joined the room`, timestamp: data.timestamp }]);
      const handleUserLeft = (data) => setMessages((prev) => [...prev, { type: 'system', message: `${data.username} left the room`, timestamp: data.timestamp }]);
      const handleReactionAdded = (data) => setMessages((prev) => prev.map((msg) => {
        if (msg.id !== data.messageId) return msg;
        const reactions = { ...msg.reactions };
        if (!reactions[data.emoji]) reactions[data.emoji] = [];
        if (!reactions[data.emoji].includes(data.username)) reactions[data.emoji].push(data.username);
        return { ...msg, reactions };
      }));
      const handleReactionRemoved = (data) => setMessages((prev) => prev.map((msg) => {
        if (msg.id !== data.messageId) return msg;
        const reactions = { ...msg.reactions };
        if (reactions[data.emoji]) {
          reactions[data.emoji] = reactions[data.emoji].filter((u) => u !== data.username);
          if (reactions[data.emoji].length === 0) delete reactions[data.emoji];
        }
        return { ...msg, reactions };
      }));

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
      const handleClickOutside = (event) => {
        if (showEmojiPicker && emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) && emojiToggleRef.current && !emojiToggleRef.current.contains(event.target)) setShowEmojiPicker(false);
        if (showUsers && usersPanelRef.current && !usersPanelRef.current.contains(event.target) && usersToggleRef.current && !usersToggleRef.current.contains(event.target)) setShowUsers(false);
        if (showSearch && searchPanelRef.current && !searchPanelRef.current.contains(event.target) && searchToggleRef.current && !searchToggleRef.current.contains(event.target)) setShowSearch(false);
        if (showReactionPicker && reactionPickerRef.current && !reactionPickerRef.current.contains(event.target)) setShowReactionPicker(null);
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker, showUsers, showSearch, showReactionPicker]);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
      if (message.trim() && username) {
        const messageData = { room: roomId, username, message, timestamp: new Date().toISOString(), replyTo: replyingTo };
        socket.emit('chat message', messageData);
        setMessage('');
        setReplyingTo(null);
        setShowEmojiPicker(false);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      sendMessage();
    };

    const handleUsernameSubmit = (e) => {
      e.preventDefault();
      if (username.trim()) setIsUsernameSet(true);
    };

    const copyRoomId = () => {
      navigator.clipboard.writeText(roomId);
      alert('Room ID copied!');
    };

    const addEmoji = (emoji) => setMessage((prev) => prev + emoji);

    const clearChat = () => {
      if (window.confirm('Clear chat history?')) setMessages([]);
    };

    const exportChat = () => {
      const chatText = messages.map((msg) => msg.type === 'system' ? `[${new Date(msg.timestamp).toLocaleString()}] ${msg.message}` : `[${new Date(msg.timestamp).toLocaleString()}] ${msg.username}: ${msg.message}`).join('\n');
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `chat-${roomId}-${Date.now()}.txt`; a.click();
      URL.revokeObjectURL(url);
    };

    const handleReply = (msg) => setReplyingTo({ id: msg.id, username: msg.username, message: msg.message });
    const cancelReply = () => setReplyingTo(null);

    const handleReaction = (messageId, emoji) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      const reactions = msg.reactions || {};
      const hasReacted = reactions[emoji]?.includes(username);
      if (hasReacted) socket.emit('remove_reaction', { room: roomId, messageId, emoji, username });
      else socket.emit('add_reaction', { room: roomId, messageId, emoji, username });
      setShowReactionPicker(null);
    };

    const filteredMessages = searchQuery
      ? messages.filter((msg) => msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) || msg.username?.toLowerCase().includes(searchQuery.toLowerCase()))
      : messages;

    if (!isUsernameSet) {
      return (
        <>
          <style>{styles}</style>
          <div className="nb-username-screen">
            <h2 className="nb-login-title">Chat-ME</h2>
            <div className="nb-login-card">
              <form onSubmit={handleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="nb-login-label">Who are you?</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username..."
                    maxLength={20}
                    className="nb-login-input"
                  />
                </div>
                <button type="submit" className="nb-login-btn">
                  Enter Room →
                </button>
              </form>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <style>{styles}</style>
        <div className="nb-chat-outer">
          <div className="nb-chat-root">

            {/* Header */}
            <div className="nb-header">
              <div className="nb-header-left">
                <button onClick={() => navigate('/')} className="nb-back-btn" title="Leave Room">
                  <ArrowLeft size={20} />
                </button>
                <div className="nb-avatar">
                  {username.charAt(0).toUpperCase()}
                  <div className="nb-online-dot" />
                </div>
                <div className="nb-room-info">
                  <div className="nb-room-name">
                    #{roomId.slice(0, 8)}
                    <button onClick={copyRoomId} className="nb-copy-btn" title="Copy Room ID">
                      <Copy size={12} />
                    </button>
                  </div>
                  <span className="nb-online-label">● Online</span>
                </div>
              </div>

              <div className="nb-header-actions">
                <button
                  ref={searchToggleRef}
                  className={`nb-icon-btn ${showSearch ? 'active' : ''}`}
                  onClick={() => setShowSearch(!showSearch)}
                  title="Search"
                >
                  <Search size={18} />
                </button>
                <button
                  ref={usersToggleRef}
                  className={`nb-icon-btn user ${showUsers ? 'active' : ''}`}
                  onClick={() => setShowUsers(!showUsers)}
                  title="Users"
                >
                  <Users size={18} />
                  <span>{onlineUsers.length}</span>
                </button>
                <button onClick={exportChat} className="nb-icon-btn download" title="Export" style={{ marginLeft: '8px' }}>
                  <Download size={18} />
                </button>
                <button onClick={clearChat} className="nb-icon-btn danger" title="Clear Chat">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Users Panel */}
            {showUsers && (
              <div ref={usersPanelRef} className="nb-panel">
                <div className="nb-panel-title">
                  Active Members
                  <span className="nb-badge">{onlineUsers.length}</span>
                </div>
                <div className="nb-users-list">
                  {onlineUsers.map((user, i) => (
                    <div key={i} className="nb-user-chip">
                      <div className="nb-user-dot" />
                      {user}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Panel */}
            {showSearch && (
              <div ref={searchPanelRef} className="nb-panel" style={{ padding: '12px 20px' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="nb-search-input"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="nb-action-btn">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="nb-messages">
              {filteredMessages.length === 0 && searchQuery && (
                <div className="nb-empty">
                  <div className="nb-empty-icon">🔍</div>
                  <div className="nb-empty-text">No results found</div>
                </div>
              )}

              {filteredMessages.map((msg, index) => {
                if (msg.type === 'system') {
                  return (
                    <div key={index} className="nb-system-msg">
                      <span className="nb-system-tag">{msg.message}</span>
                    </div>
                  );
                }

                const isMe = msg.username === username;

                return (
                  <div key={msg.id || index} className={`nb-msg-row ${isMe ? 'me' : 'them'}`}>
                    <div className="nb-msg-inner">
                      <div className="nb-bubble-wrap">
                        {/* Reaction Picker */}
                        {showReactionPicker === msg.id && (
                          <div ref={reactionPickerRef} className="nb-reaction-picker">
                            {reactionEmojis.map((emoji) => (
                              <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="nb-emoji-btn-sm">{emoji}</button>
                            ))}
                          </div>
                        )}

                        {/* Bubble */}
                        <div className={`nb-bubble ${isMe ? 'me' : 'them'}`}>
                          {/* Reply preview */}
                          {msg.replyTo && (
                            <div className="nb-reply-preview">
                              <div className="nb-reply-who"><Reply size={9} /> {msg.replyTo.username}</div>
                              <div className="nb-reply-text">"{msg.replyTo.message}"</div>
                            </div>
                          )}

                          {!isMe && <div className="nb-sender-name">{msg.username}</div>}

                          <p style={{ margin: 0 }}>{msg.message}</p>

                          {/* Reactions */}
                          {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <div className="nb-reactions">
                              {Object.entries(msg.reactions).map(([emoji, users]) => (
                                <button
                                  key={emoji}
                                  className={`nb-reaction-badge ${users.includes(username) ? 'mine' : ''}`}
                                  onClick={() => handleReaction(msg.id, emoji)}
                                >
                                  {emoji} {users.length}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Side actions */}
                      <div className="nb-side-actions">
                        <button onClick={() => handleReply(msg)} className="nb-action-btn" title="Reply">
                          <Reply size={13} />
                        </button>
                        <button onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)} className="nb-action-btn" title="React">
                          <Smile size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="nb-meta">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && <CheckCheck size={12} style={{ color: '#ff3c00' }} />}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Typing indicator */}
            {typingStatus && (
              <div className="nb-typing">
                <div className="nb-typing-dots">
                  <div className="nb-typing-dot" />
                  <div className="nb-typing-dot" />
                  <div className="nb-typing-dot" />
                </div>
                <span className="nb-typing-text">{typingStatus}</span>
              </div>
            )}

            {/* Input area */}
            <div className="nb-input-area" style={{ position: 'relative' }}>
              {/* Reply banner */}
              {replyingTo && (
                <div className="nb-reply-banner">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nb-reply-label">↩ Replying to {replyingTo.username}</div>
                    <div className="nb-reply-quote">{replyingTo.message}</div>
                  </div>
                  <button onClick={cancelReply} className="nb-cancel-reply"><X size={13} /></button>
                </div>
              )}

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div ref={emojiPickerRef} className="nb-emoji-picker-popup">
                  {emojis.map((emoji, i) => (
                    <button key={i} onClick={() => addEmoji(emoji)} className="nb-emoji-btn">{emoji}</button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="nb-input-row">
                <div className="nb-input-wrap">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      socket.emit('typing', { room: roomId, username });
                    }}
                    placeholder="Type message..."
                    maxLength={500}
                    className="nb-text-input"
                  />
                  <button
                    ref={emojiToggleRef}
                    type="button"
                    className="nb-emoji-toggle"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={20} />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="nb-send-btn"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

  export default ChatRoom;