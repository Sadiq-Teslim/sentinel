import React, { useState } from 'react';
import Layout from '../components/Layout';
import { createDelegation, type DelegationToken } from '../lib/identity';
import { Users, UserCheck, Shield, FileText } from 'lucide-react';

const Proxy: React.FC = () => {
    const [step, setStep] = useState(1); // 1: Select, 2: Loading, 3: Active
    const [token, setToken] = useState<DelegationToken | null>(null);

    const agents = [
        { name: "Musa Ibrahim", id: "AGT_8821", loc: "Wuse Zone 4", rating: "4.9" },
        { name: "Nkechi Obi", id: "AGT_9910", loc: "Lagos Island", rating: "4.8" }
    ];

    const handleAuthorize = async (agentName: string) => {
        setStep(2);
        const newToken = await createDelegation(agentName);
        setToken(newToken);
        setStep(3);
    };

    return (
        <Layout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Proxy Access</h1>
                    <p className="text-sm text-gray-500">Authorize a trusted agent to act on your behalf.</p>
                </div>

                {/* STEP 1: SELECT AGENT */}
                {step === 1 && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 items-start">
                             <Shield className="text-yellow-600 shrink-0 mt-1" size={18} />
                             <p className="text-xs text-yellow-800 leading-relaxed">
                                <b>Safety Note:</b> Only authorize agents you physically trust. This creates a signed digital contract allowing them to view your ID.
                             </p>
                        </div>

                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-4">Verified Agents Nearby</h3>
                        
                        {agents.map((agent, i) => (
                            <button 
                                key={i}
                                onClick={() => handleAuthorize(agent.name)}
                                className="w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:border-ng-green transition-all active:scale-98 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 p-3 rounded-full group-hover:bg-green-50 transition-colors">
                                        <Users size={24} className="text-gray-500 group-hover:text-ng-green" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-gray-900">{agent.name}</p>
                                        <p className="text-xs text-gray-500">ID: {agent.id} • {agent.loc}</p>
                                    </div>
                                </div>
                                <div className="bg-green-50 text-ng-green text-xs font-bold px-2 py-1 rounded">
                                    ★ {agent.rating}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* STEP 2: LOADING */}
                {step === 2 && (
                    <div className="text-center py-20 animate-in fade-in duration-300">
                        <div className="animate-spin w-12 h-12 border-4 border-ng-green border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="font-bold text-gray-800">Signing Delegation Token...</p>
                        <p className="text-xs text-gray-500 mt-2">Creating Audit Log Entry</p>
                    </div>
                )}

                {/* STEP 3: ACTIVE TOKEN */}
                {step === 3 && token && (
                    <div className="animate-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-green-600 text-white rounded-[2rem] p-6 shadow-xl mb-6 relative overflow-hidden">
                            <div className="flex items-center gap-2 mb-4">
                                <UserCheck size={28} />
                                <span className="font-bold text-lg">Active Delegation</span>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-green-200 text-xs font-bold uppercase">Authorized Proxy</p>
                                    <p className="text-2xl font-black">{token.proxyName}</p>
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-green-200 text-xs font-bold uppercase">Expires</p>
                                        <p className="font-mono font-medium">1 Hour</p>
                                    </div>
                                    <div>
                                        <p className="text-green-200 text-xs font-bold uppercase">Token ID</p>
                                        <p className="font-mono font-medium">{token.tokenId}</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bg Pattern */}
                            <Shield className="absolute -right-6 -bottom-6 text-white opacity-20" size={120} />
                        </div>

                        {/* Audit Log Demo */}
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText size={18} className="text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">Audit Log Trail</span>
                            </div>
                            
                            <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                                <div className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-ng-green ring-4 ring-white"></div>
                                    <p className="text-xs font-bold text-gray-800">Delegation Granted</p>
                                    <p className="text-[10px] text-gray-400 font-mono">Hash: {token.signature.substring(0, 15)}...</p>
                                    <p className="text-[10px] text-gray-400">Just now</p>
                                </div>
                                <div className="relative opacity-50">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></div>
                                    <p className="text-xs font-bold text-gray-800">Identity Check</p>
                                    <p className="text-[10px] text-gray-400">System</p>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => setStep(1)} 
                            className="w-full mt-6 bg-white border border-red-200 text-red-500 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors"
                        >
                            Revoke Access
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Proxy;