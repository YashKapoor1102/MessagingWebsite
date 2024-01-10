import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login'; 
import RegisterPage from './pages/Register'; 
import HomePage from './pages/Home'; 
import Chat from './pages/Chat';
import io from "socket.io-client";

const socket = io("http://localhost:5000")

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<Chat socket={socket} />} />
        </Routes>
      </Router>
    );
  }
  

export default App;