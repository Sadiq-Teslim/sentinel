import React, { useState } from 'react';
import Layout from '../components/Layout';
import { generateCredential, getStoredCredential, revokeCredential, type VerifiableCredential } from '../lib/identity';
import { Trash2, Fingerprint, Lock, CheckCircle2 } from 'lucide-react';

const Wallet: React.FC = () => {
    const [cred, setCred] = useState<VerifiableCredential | null>(() => getStoredCredential());
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        setLoading(true);
        const newCred = await generateCredential("AMAKA UCHE"); // Mock User Name
        setCred(newCred);
        setLoading(false);
    };

    const handleRevoke = () => {
        if(confirm("Revoke this ID? This action is permanent.")) {
            revokeCredential();
            setCred(null);
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-black mb-4">Digital Wallet</h1>

                {!cred ? (
                    // EMPTY STATE
                    <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Fingerprint size={40} className="text-ng-green" />
                        </div>
                        <h3 className="font-bold text-gray-800">No Active Credential</h3>
                        <p className="text-xs text-gray-500 mb-6 px-8">
                            Generate a sovereign digital identity secured by the NiRA root of trust.
                        </p>
                        <button 
                            onClick={handleCreate}
                            disabled={loading}
                            className="bg-ng-green text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {loading ? "Encrypting..." : "Generate Credential"}
                        </button>
                    </div>
                ) : (
                    // CREDENTIAL CARD (The "VC")
                    <div className="animate-in slide-in-from-bottom-5 fade-in duration-500">
                        {/* The Visual Card */}
                        <div className="bg-gradient-to-br from-[#008751] to-[#006039] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden mb-6 aspect-[1.6/1]">
                             {/* Patterns */}
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                             
                             <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🇳🇬</span>
                                    <div className="leading-none">
                                        <p className="text-[8px] uppercase tracking-widest opacity-80">Federal Republic of Nigeria</p>
                                        <p className="font-bold text-sm">National Digital ID</p>
                                    </div>
                                </div>
                                <div className="bg-white/20 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1">
                                    <Lock size={10} />
                                    <span className="text-[10px] font-bold">SECURE</span>
                                </div>
                             </div>

                             <div className="space-y-1 relative z-10">
                                <p className="text-[10px] uppercase opacity-70">Identity Name</p>
                                <p className="font-bold text-xl">{cred.name}</p>
                             </div>

                             <div className="absolute bottom-6 left-6 z-10">
                                <p className="text-[10px] uppercase opacity-70">NIN</p>
                                <p className="font-mono text-lg tracking-widest">{cred.nin}</p>
                             </div>
                        </div>

                        {/* Technical Proofs */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg text-xs font-bold">
                                <CheckCircle2 size={14} />
                                Signature Validated
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Cryptographic Hash</p>
                                <p className="font-mono text-[10px] break-all bg-gray-50 p-2 rounded border border-gray-200 text-gray-600">
                                    {cred.signature}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 uppercase font-bold">Issuer DID</p>
                                <p className="font-mono text-xs text-gray-800">{cred.issuer}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleRevoke}
                            className="mt-6 w-full flex items-center justify-center gap-2 text-red-500 font-bold text-sm py-3 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <Trash2 size={16} />
                            Revoke Credential
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wallet;