import React, { useState, useEffect, type ReactNode } from 'react';
import { Wifi, WifiOff, ShieldCheck, Menu } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200 relative pb-24">
      
      {/* 1. Top Status Bar */}
      <div className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center transition-colors duration-300 ${isOnline ? 'bg-gray-900 text-white' : 'bg-yellow-500 text-black'}`}>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi size={14} className="text-green-400" /> : <WifiOff size={14} />}
          <span>{isOnline ? 'Sentinel Uplink: Active' : 'Offline Mode: Local Cache'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={14} className={isOnline ? "text-[#008751]" : "text-black"} />
          <span>.ng Secured</span>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="w-full">
        {children}
      </main>

      {/* 3. Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
         <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-mono tracking-tighter">V.1.0.4 (Beta)</span>
            <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#008751] animate-pulse"></span>
                <span className="text-sm font-black text-[#008751] tracking-wide">SENTINEL</span>
            </div>
         </div>
         
         <button className="p-2 hover:bg-gray-50 rounded-full transition-colors active:scale-95">
            <Menu size={20} className="text-gray-400" />
         </button>
      </nav>
    </div>
  );
};

export default Layout;