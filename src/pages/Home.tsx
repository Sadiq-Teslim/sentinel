import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { checkDomainSecurity, type ScanResult, type SecurityStatus } from '../lib/scanner';
import { useAudioAlert } from '../hooks/useAudioAlert';
import { ShieldCheck, ShieldAlert, Search, Globe, Volume2, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  const [domain, setDomain] = useState<string>('');
  const [status, setStatus] = useState<SecurityStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [language, setLanguage] = useState<string>('english');
  
  const [searchParams] = useSearchParams();
  const { playAlert, stopAlert, isPlaying } = useAudioAlert();

    const handleScan = useCallback(async (e: React.FormEvent | null, manualDomain: string | null = null) => {
        if (e) e.preventDefault();
        const target = manualDomain || domain;
        if (!target) return;

        setStatus('scanning');
        setResult(null);
        stopAlert();

        try {
            const scanResult = await checkDomainSecurity(target);
            setResult(scanResult);
            setStatus(scanResult.status);

            setTimeout(() => {
                playAlert(scanResult.status, language);
            }, 500);
        } catch (err) {
            console.error('[handleScan] error', err);
            setResult(null);
            setStatus('idle');
        }
    }, [domain, stopAlert, playAlert, language]);

    // Handle WhatsApp Shares
    useEffect(() => {
        const sharedText = searchParams.get('text') || searchParams.get('url');
        if (sharedText) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const foundUrl = sharedText.match(urlRegex);
            if (foundUrl && foundUrl[0]) {
                try {
                    const urlObj = new URL(foundUrl[0]);
                    // avoid calling setState synchronously inside an effect
                    setTimeout(() => setDomain(urlObj.hostname), 0);
                    // call asynchronously to avoid blocking
                    setTimeout(() => handleScan(null, urlObj.hostname), 0);
                } catch (e) {
                    console.error("Invalid URL", e);
                }
            }
        }
        // only re-run when searchParams or handleScan identity changes
    }, [searchParams, handleScan]);

  return (
    <Layout>
      {/* --- HERO SECTION --- */}
      <div className="bg-[#008751] text-white p-6 pb-12 -mx-0 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 mt-2">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Sentinel</h1>
            <p className="text-green-50 text-xs font-medium opacity-90 max-w-[200px] leading-relaxed">
             The .ng Trust Anchor. <br/>Voice-Enabled Verification.
            </p>
        </div>
        
        {/* Language Switcher (Glass Effect) */}
        <div className="absolute top-8 right-6 z-20">
            <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded-full px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer uppercase tracking-wider text-center appearance-none min-w-[80px]"
                style={{ textAlignLast: 'center' }}
            >
                <option value="english" className="text-gray-900">🇬🇧 ENG</option>
                <option value="hausa" className="text-gray-900">🇳🇬 HAUSA</option>
                <option value="yoruba" className="text-gray-900">🇳🇬 YORUBA</option>
                <option value="igbo" className="text-gray-900">🇳🇬 IGBO</option>
            </select>
        </div>
        
        {/* Background Decor */}
        <ShieldCheck className="absolute -right-8 -bottom-8 text-white opacity-[0.15] rotate-12" size={160} />
      </div>

      {/* --- INPUT SECTION --- */}
      <div className="relative -mt-8 mb-8 px-6">
        <form onSubmit={(e) => handleScan(e)} className="relative group shadow-lg rounded-2xl">
            <input 
                type="text" 
                placeholder="e.g. firs.gov.ng"
                className="w-full h-16 pl-14 pr-4 rounded-2xl border-2 border-white bg-white focus:border-[#008751] focus:ring-4 focus:ring-green-500/10 focus:outline-none text-lg font-medium transition-all placeholder:text-gray-300 text-gray-800"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
            />
            <Search className="absolute left-5 top-5 text-gray-300 group-focus-within:text-[#008751] transition-colors" size={24} />
            
            <button 
                type="submit"
                className="absolute right-2 top-2 h-12 px-6 bg-[#008751] hover:bg-[#006b3f] text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
                Verify
            </button>
        </form>
      </div>

      {/* --- RESULTS AREA --- */}
      <div className="px-6 pb-8">

        {/* STATE: Idle */}
        {status === 'idle' && (
            <div className="text-center mt-12 opacity-60">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <Share2 className="text-gray-400" size={24} />
                </div>
                <p className="text-sm text-gray-500 font-medium">Tip: Share suspicious links from <br/>WhatsApp directly to Sentinel.</p>
            </div>
        )}

        {/* STATE: Scanning */}
        {status === 'scanning' && (
            <div className="text-center py-12">
                <div className="inline-block p-5 rounded-full bg-green-50 mb-6 relative">
                    <div className="absolute inset-0 border-4 border-[#008751] border-t-transparent rounded-full animate-spin"></div>
                    <Globe size={48} className="text-[#008751]" />
                </div>
                <p className="text-gray-900 font-bold text-lg">Interrogating NiRA Registry...</p>
                <p className="text-xs text-gray-500 mt-2 font-mono uppercase tracking-widest">Checking DNSSEC Signatures</p>
            </div>
        )}

        {/* STATE: SAFE */}
        {status === 'safe' && result && (
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border-t-4 border-[#008751]">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-green-50 p-3 rounded-2xl">
                        <ShieldCheck size={32} className="text-[#008751]" />
                    </div>
                    <button 
                        onClick={() => playAlert('safe', language)} 
                        className={`p-3 rounded-full transition-all active:scale-90 ${isPlaying ? 'bg-[#008751] text-white ring-4 ring-green-200' : 'bg-gray-100 text-gray-500 hover:bg-green-50'}`}
                    >
                        <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-3xl font-black text-gray-900 mb-1 tracking-tight">Authentic</h2>
                    <p className="text-sm text-gray-500 font-medium">This website is verified safe.</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100 mb-6">
                    <div className="flex justify-between text-sm items-center border-b border-gray-200 pb-3">
                        <span className="text-gray-400 font-medium">Domain</span>
                        <span className="font-mono font-bold text-gray-800">{result.domain}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center border-b border-gray-200 pb-3">
                        <span className="text-gray-400 font-medium">Registrar</span>
                        <span className="font-bold text-gray-800 text-right text-xs max-w-[150px]">{result.registrar}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400 font-medium">Security</span>
                        <div className="flex items-center gap-1.5 bg-green-100 text-[#006b3f] text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide">
                            <CheckCircle2 size={12} />
                            {result.dnssec ? 'DNSSEC SIGNED' : 'TRUSTED CACHE'}
                        </div>
                    </div>
                </div>
                
                <button className="w-full bg-[#008751] hover:bg-[#006b3f] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-green-200 transition-all active:scale-[0.98]">
                    Open Official Site
                </button>
            </div>
        )}

        {/* STATE: UNSAFE */}
        {status === 'unsafe' && result && (
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border-t-4 border-red-600">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-red-50 p-3 rounded-2xl">
                        <ShieldAlert size={32} className="text-red-600" />
                    </div>
                    <button 
                        onClick={() => playAlert('unsafe', language)} 
                        className={`p-3 rounded-full transition-all active:scale-90 ${isPlaying ? 'bg-red-600 text-white ring-4 ring-red-200' : 'bg-gray-100 text-gray-500 hover:bg-red-50'}`}
                    >
                        <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-3xl font-black text-red-600 mb-1 tracking-tight">Warning!</h2>
                    <p className="text-sm text-gray-500 font-medium">This site matches phishing patterns.</p>
                </div>

                <div className="bg-red-50 rounded-2xl p-5 mb-6 border border-red-100">
                    <ul className="space-y-3">
                        {result.details.map((msg, i) => (
                            <li key={i} className="text-xs text-red-800 font-bold flex items-start gap-2">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                {msg}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-red-200 transition-all active:scale-[0.98]">
                    Exit Immediately
                </button>
            </div>
        )}

        {/* STATE: CAUTION */}
        {status === 'caution' && result && (
            <div className="bg-white rounded-[2rem] p-6 shadow-2xl border-t-4 border-yellow-500">
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-yellow-50 p-3 rounded-2xl">
                        <AlertTriangle size={32} className="text-yellow-600" />
                    </div>
                    <button 
                        onClick={() => playAlert('caution', language)} 
                        className={`p-3 rounded-full transition-all active:scale-90 ${isPlaying ? 'bg-yellow-500 text-white ring-4 ring-yellow-200' : 'bg-gray-100 text-gray-500 hover:bg-yellow-50'}`}
                    >
                        <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
                    </button>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-black text-gray-800 mb-1 tracking-tight">Proceed with Caution</h2>
                    <p className="text-sm text-gray-500 font-medium">We cannot verify this site's owner.</p>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-5 text-xs font-medium text-yellow-900 leading-relaxed mb-6 border border-yellow-100">
                     {/* Show dynamic details here */}
                     {result.details.map((msg, i) => (
                        <p key={i} className="mb-1">• {msg}</p>
                    ))}
                </div>
                
                <button className="w-full bg-white border-2 border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98]">
                    I Understand the Risk
                </button>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;