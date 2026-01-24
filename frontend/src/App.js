import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';

function App() {
  return (
    <Router>
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:roomId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 