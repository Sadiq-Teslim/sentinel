import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Proxy from './pages/Proxy'; // Import Proxy

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/proxy" element={<Proxy />} /> {/* New Route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;