# ChatME - Real-time Chat Application

A simple real-time chat application built with React and Socket.IO.

🚀 **Live Demo**: [https://chatme-ruddy.vercel.app/](https://chatme-ruddy.vercel.app/)

## Features

- Create unique chat rooms with shareable links
- Real-time messaging using Socket.IO
- No database required (messages are not persisted)
- Clean and modern UI
- Username-based chat

## Project Structure

```
chat-app/
├── frontend/           # React frontend
│   ├── src/
│   │   ├── pages/     # React components
│   │   ├── App.js     # Main App component
│   │   └── index.js   # Entry point
│   └── package.json   # Frontend dependencies
└── backend/           # Node.js backend
    ├── server.js      # Socket.IO server
    └── package.json   # Backend dependencies
```

## Quick Start

Want to try it out immediately? Visit the live demo at [https://chatme-ruddy.vercel.app/](https://chatme-ruddy.vercel.app/)

## Local Development Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server will run on http://localhost:3001

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on http://localhost:3000

## Usage

1. Open the [live demo](https://chat-me-omega.vercel.app/) or http://localhost:3000 for local development
2. Click "Create New Room" to generate a new chat room
3. Share the room URL with others to chat together
4. Enter a username when joining a room
5. Start chatting!

## Technologies Used

- React
- Socket.IO
- React Router
- Node.js
- Express
