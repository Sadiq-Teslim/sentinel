import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; // Import Landing
import Home from './pages/Home';
import Wallet from './pages/Wallet';
import Proxy from './pages/Proxy';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* The Landing Page is now the root */}
        <Route path="/" element={<Landing />} />
        
        {/* The App functionality is moved to /scan */}
        <Route path="/scan" element={<Home />} />
        
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/proxy" element={<Proxy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;