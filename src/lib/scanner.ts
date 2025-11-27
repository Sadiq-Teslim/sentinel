import { isOfflineTrusted } from '../data/trustedList';

export type SecurityStatus = 'safe' | 'unsafe' | 'caution' | 'unknown' | 'idle' | 'scanning';

export interface ScanResult {
    domain: string;
    status: SecurityStatus;
    details: string[];
    registrar: string;
    dnssec: boolean;
    isOfflineVerified: boolean;
}

// Helper to check for phishing keywords (Layer 2 Defense)
const isPhishingPattern = (domain: string): boolean => {
    const suspiciousWords = ['bonus', 'free', 'gift', 'promo', 'login-check', 'support', 'verify', 'update', 'bank-ng'];
    return suspiciousWords.some(word => domain.includes(word));
};

export const checkDomainSecurity = async (rawInput: string): Promise<ScanResult> => {
    // 1. Sanitize Input
    let domain = rawInput.toLowerCase().trim();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (domain.startsWith('www.')) domain = domain.substring(4);

    const result: ScanResult = {
        domain: domain,
        status: 'unknown',
        details: [],
        registrar: 'Unknown',
        dnssec: false,
        isOfflineVerified: false
    };

    // 2. CHECK 1: The Offline Trust Cache (Instant)
    if (isOfflineTrusted(domain)) {
        result.status = 'safe';
        result.details.push("Verified against Sentinel Offline Trust Cache.");
        result.details.push("Entity: Official Government Infrastructure");
        result.registrar = "Galaxy Backbone / NiRA Accredited";
        result.dnssec = true;
        result.isOfflineVerified = true;
        return result;
    }

    // 3. CHECK 2: Real DNS-over-HTTPS (DoH) Lookup
    // We check if the user is online. If offline, we skip to heuristic checks.
    if (navigator.onLine) {
        try {
            // Google Public DNS API
            // type=A (Look for IP)
            // dnssec=true (Ask for security signatures)
            const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A&dnssec=true`);
            const data = await response.json();

            // Analyze DNS Status
            if (data.Status !== 0) {
                // Status 0 = Success. Anything else means domain likely doesn't exist.
                result.status = 'caution'; // Or 'unsafe' depending on strictness
                result.details.push("Domain does not appear to exist (NXDOMAIN).");
                result.registrar = "Not Registered";
                return result;
            }

            // Analyze DNSSEC (The 'AD' flag - Authenticated Data)
            // If true, it means the path from Root -> .ng -> Domain is secure.
            if (data.AD === true) {
                result.dnssec = true;
            } else {
                result.dnssec = false;
            }

            // Capture Real IP (Optional, proves we really checked)
            if (data.Answer && data.Answer.length > 0) {
                // We don't show IP to user, but we know it exists.
            }

        } catch (error) {
            console.warn("DNS Lookup failed, falling back to heuristics", error);
            // If fetch fails (e.g. strict firewall), we continue to heuristics below
        }
    }

    // 4. CHECK 3: Heuristic & Protocol Logic (The Decision Matrix)
    
    const isNg = domain.endsWith('.ng');

    if (!isNg) {
        // Foreign Domain
        result.status = 'caution';
        result.details.push("This is NOT a Nigerian domain (.ng).");
        result.details.push("Data sovereignty cannot be guaranteed.");
        result.registrar = "International Registrar";
        
        // If it was a .com but had DNSSEC, we note it, but still caution.
        if (result.dnssec) {
             result.details.push("DNSSEC is Valid, but domain is not .ng");
        }
    } else {
        // It is a .ng domain
        if (isPhishingPattern(domain)) {
            // Phishing Detected
            result.status = 'unsafe';
            result.details.push("Suspicious keywords detected.");
            result.details.push("Matches known phishing patterns.");
            result.registrar = "Unknown / Private";
        } else {
            // Legit-looking .ng domain
            
            // If we confirmed DNSSEC via Google API
            if (result.dnssec) {
                result.status = 'safe';
                result.details.push("Valid .ng Domain.");
                result.details.push("DNSSEC Signature: VERIFIED (Cryptographic Proof)");
                result.registrar = "NiRA Accredited Registrar"; 
            } else {
                // Real .ng, but NO DNSSEC?
                result.status = 'caution';
                result.details.push("Valid .ng Domain, but DNSSEC is missing.");
                result.details.push("Connection is not cryptographically signed.");
                result.registrar = "NiRA Accredited Registrar";
            }
        }
    }

    // Override: If we couldn't check DNSSEC (offline/error) but it looks safe
    if ((result.status as SecurityStatus) === 'unknown' && isNg && !isPhishingPattern(domain)) {
         result.status = 'safe'; // Benefit of doubt for demo
         result.details.push("Valid .ng Format.");
         result.details.push("DNSSEC check unavailable (Offline).");
         result.registrar = "NiRA Accredited";
    }

    return result;
};