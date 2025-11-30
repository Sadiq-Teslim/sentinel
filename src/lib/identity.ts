// src/lib/identity.ts

// --- TYPES ---
export interface VerifiableCredential {
    id: string;
    name: string;
    nin: string;
    timestamp: string;
    issuer: string;
    signature: string;
}

export interface DelegationToken {
    tokenId: string;
    proxyName: string;
    proxyDid: string;
    permissions: string[];
    expiresAt: string;
    signature: string;
    status: 'active' | 'revoked';
}

export interface AuditLog {
    timestamp: string;
    action: string;
    actor: string;
    hash: string;
}

// --- CREDENTIAL LOGIC ---

export const generateCredential = async (name: string): Promise<VerifiableCredential> => {
    // Simulate encryption delay
    await new Promise(r => setTimeout(r, 1500));

    const mockNIN = "2938 1029 481";
    const timestamp = new Date().toISOString();
    const issuer = "did:ng:nimc:official";
    
    // Create a fake cryptographic signature
    const rawString = `${name}-${mockNIN}-${timestamp}-${issuer}`;
    const signature = "sig_sha256_" + btoa(rawString).substring(0, 24) + "...";

    const vc: VerifiableCredential = {
        id: crypto.randomUUID(),
        name,
        nin: mockNIN,
        timestamp,
        issuer,
        signature
    };

    localStorage.setItem('sentinel_id', JSON.stringify(vc));
    return vc;
};

export const getStoredCredential = (): VerifiableCredential | null => {
    const data = localStorage.getItem('sentinel_id');
    return data ? JSON.parse(data) : null;
};

export const revokeCredential = () => {
    localStorage.removeItem('sentinel_id');
};

// --- PROXY DELEGATION LOGIC ---

export const createDelegation = async (proxyName: string): Promise<DelegationToken> => {
    await new Promise(r => setTimeout(r, 1000));

    const token: DelegationToken = {
        tokenId: "del_" + Math.random().toString(36).substring(2, 9),
        proxyName: proxyName,
        proxyDid: "did:sentinel:agent:musa_882",
        permissions: ["domain_verify", "service_access"],
        expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(), // 1 hour
        signature: "sig_rsa_" + btoa(proxyName + Date.now()).substring(0, 16),
        status: 'active'
    };

    // Store fake audit log
    const log: AuditLog = {
        timestamp: new Date().toISOString(),
        action: "DELEGATION_GRANTED",
        actor: "User (Owner)",
        hash: "sha_" + Math.random().toString(16).substring(2)
    };
    
    // In a real app, we'd append this to a secure log
    console.log("Audit Log:", log);

    return token;
};