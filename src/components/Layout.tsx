import React, { useState, useEffect, type ReactNode } from "react";
import { Wifi, WifiOff, ShieldCheck, Home, Wallet, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200 relative pb-24">
      {/* 1. Top Status Bar (The "Satellite Link") */}
      <div
        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest flex justify-between items-center transition-colors duration-300 ${
          isOnline ? "bg-gray-900 text-white" : "bg-yellow-500 text-black"
        }`}
      >
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi size={12} className="text-green-400" />
          ) : (
            <WifiOff size={12} />
          )}
          <span>
            {isOnline ? "Sentinel Uplink: Active" : "Offline Mode: Local Cache"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck
            size={12}
            className={isOnline ? "text-ng-green" : "text-black"}
          />
          <span>.ng Secured</span>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="p-0 animate-in fade-in duration-500">{children}</main>

      {/* 3. Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 px-2 py-2 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {/* SCAN */}
        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center p-2 rounded-xl w-20 transition-all duration-300 ${
            location.pathname === "/"
              ? "text-ng-green bg-green-50 scale-105"
              : "text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Home size={24} strokeWidth={location.pathname === "/" ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Scan</span>
        </button>

        {/* WALLET */}
        <button
          onClick={() => navigate("/wallet")}
          className={`flex flex-col items-center p-2 rounded-xl w-20 transition-all duration-300 ${
            location.pathname === "/wallet"
              ? "text-ng-green bg-green-50 scale-105"
              : "text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Wallet
            size={24}
            strokeWidth={location.pathname === "/wallet" ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold mt-1">ID Wallet</span>
        </button>

        {/* PROXY (Updated) */}
        <button
          onClick={() => navigate("/proxy")}
          className={`flex flex-col items-center p-2 rounded-xl w-20 transition-all duration-300 ${
            location.pathname === "/proxy"
              ? "text-ng-green bg-green-50 scale-105"
              : "text-gray-400 hover:bg-gray-50"
          }`}
        >
          <Users
            size={24}
            strokeWidth={location.pathname === "/proxy" ? 2.5 : 2}
          />
          <span className="text-[10px] font-bold mt-1">Proxy</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
