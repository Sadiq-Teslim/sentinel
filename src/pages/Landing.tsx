import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, WifiOff, Volume2, ArrowRight, Lock, Users, Globe } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans max-w-md mx-auto shadow-2xl overflow-hidden border-x border-gray-200 relative">
      
      {/* --- HERO SECTION --- */}
      <div className="bg-[#008751] text-white p-6 pb-12 pt-12 relative overflow-hidden rounded-b-[3rem] shadow-xl">
        {/* Background Patterns */}
        <ShieldCheck className="absolute -right-10 -top-10 text-green-400 opacity-20 rotate-12" size={200} />
        
        <div className="relative z-10 animate-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse"></span>
                Team Sentinel
            </div>
            
            <h1 className="text-4xl font-black mb-4 leading-tight">
                The <span className="text-green-200">.ng</span> Trust Anchor.
            </h1>
            
            <p className="text-green-50 text-base font-medium leading-relaxed opacity-90 mb-8 max-w-[90%]">
                A voice-enabled, offline-first digital trust ecosystem designed for the 50% of Nigerians left behind by the digital divide.
            </p>

            <button 
                onClick={() => navigate('/scan')}
                className="group w-full bg-white text-[#008751] py-4 rounded-xl font-black text-lg shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
                Launch Sentinel
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
        </div>
      </div>

      {/* --- PROBLEM STATEMENT --- */}
      <div className="p-6 py-10">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">The Challenge</h2>
        
        <div className="space-y-6">
            <div className="flex gap-4 items-start">
                <div className="bg-red-50 p-3 rounded-2xl shrink-0">
                    <Lock className="text-red-500" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">The Invisible Shield</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        NiRA has robust security (DNSSEC), but it is invisible to users. Citizens cannot tell a real .gov.ng site from a fake one.
                    </p>
                </div>
            </div>

            <div className="flex gap-4 items-start">
                <div className="bg-orange-50 p-3 rounded-2xl shrink-0">
                    <Users className="text-orange-500" size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">The Literacy Gap</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mt-1">
                        Most tools require complex reading. We exclude millions of Nigerians who rely on local languages and voice.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* --- HOW IT WORKS (THE SOLUTION) --- */}
      <div className="bg-gray-50 p-6 py-12 border-y border-gray-100">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 text-center">How Sentinel Works</h2>
        
        <div className="grid gap-4">
            {/* Feature 1 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">1. Trust Scoring</h3>
                    <Globe className="text-[#008751]" size={20} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    We analyze DNSSEC, DANE, and Domain Age to give every .ng site a visual Trust Score (0-100%).
                </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">2. YarnGPT Voice</h3>
                    <Volume2 className="text-[#008751]" size={20} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Using Nigerian AI, we <b>speak</b> the verification results in Hausa, Yoruba, and Igbo.
                </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900">3. Offline-First</h3>
                    <WifiOff className="text-[#008751]" size={20} />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                    Pre-loaded with a cryptographically signed "Trust Cache" of critical government nodes. Works on 2G.
                </p>
            </div>
        </div>
      </div>

      {/* --- IMPACT & CTA --- */}
      <div className="p-6 py-10 pb-16">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Our Impact</h2>
        <p className="text-xl font-black text-gray-900 mb-6 leading-tight">
            Bridging the gap between <span className="text-[#008751]">NiRA's Infrastructure</span> and the <span className="text-[#008751]">Common Citizen</span>.
        </p>

        <button 
            onClick={() => navigate('/scan')}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl active:scale-[0.98] transition-all"
        >
            Start Verifying
        </button>

        <p className="text-[10px] text-center text-gray-400 mt-6 font-mono">
            Built for NKF NiRA-XT Hackathon II
        </p>
      </div>
    </div>
  );
};

export default Landing;