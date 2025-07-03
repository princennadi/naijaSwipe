import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Liked from './pages/Liked';
import Login from './pages/Login';
import Landing from './pages/Landing'; // ⬅️ Import new landing page
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} /> {/* ⬅️ Show Landing at root */}
        <Route path="/browse" element={<App />} /> {/* ⬅️ App moved to /browse */}
        <Route path="/liked" element={<Liked />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
