// src/lib/scanner.ts
import { isOfflineTrusted } from '../data/trustedList';

export type SecurityStatus = 'safe' | 'unsafe' | 'caution' | 'unknown' | 'idle' | 'scanning';

export interface ScanResult {
    domain: string;
    status: SecurityStatus;
    trustScore: number; // 0.0 to 1.0 (displayed as %)
    details: string[];
    registrar: string;
    
    // Technical Flags (From your screenshot)
    hasDNSSEC: boolean;
    hasTLS: boolean;
    hasDANE: boolean;
    domainAge: 'mature' | 'new'; // "new" lowers score
}

export const checkDomainSecurity = async (rawInput: string): Promise<ScanResult> => {
    // 1. Sanitize
    let domain = rawInput.toLowerCase().trim();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '');

    // Default Result
    const result: ScanResult = {
        domain: domain,
        status: 'unknown',
        trustScore: 0,
        details: [],
        registrar: 'Unknown',
        hasDNSSEC: false,
        hasTLS: false,
        hasDANE: false,
        domainAge: 'new'
    };

    // 2. OFFLINE TRUST CACHE (Instant 100% Score)
    if (isOfflineTrusted(domain)) {
        result.status = 'safe';
        result.trustScore = 1.0;
        result.hasDNSSEC = true;
        result.hasTLS = true;
        result.hasDANE = true;
        result.domainAge = 'mature';
        result.registrar = "Galaxy Backbone / NiRA Accredited";
        result.details.push("Verified by Offline Trust Anchor");
        return result;
    }

    // 3. SIMULATE NETWORK DELAY
    await new Promise(r => setTimeout(r, 1500));

    // 4. SCORING LOGIC (The "Weighted Rules")
    let score = 0;
    const isNg = domain.endsWith('.ng');
    const isSuspicious = ['bonus', 'free', 'gift', 'promo', 'login'].some(w => domain.includes(w));

    // A. Base Trust (NiRA Sovereignty)
    if (isNg) score += 0.3; // +30% for being .ng

    // B. DNSSEC Check (Simulated)
    // In a real demo, we assume legitimate .ng sites have this
    if (isNg && !isSuspicious) {
        result.hasDNSSEC = true;
        score += 0.3; // +30% for DNSSEC
    }

    // C. TLS/SSL Check
    if (!domain.startsWith('http:')) { // Assume https
        result.hasTLS = true;
        score += 0.2; // +20% for TLS
    }

    // D. DANE (DNS-based Authentication of Named Entities)
    // This is a "High Security" feature usually only top gov sites have
    if (domain.includes('gov.ng') || domain.includes('cbn')) {
        result.hasDANE = true;
        score += 0.1; // +10% for DANE
    }

    // E. Domain Age
    if (!isSuspicious) {
        result.domainAge = 'mature';
        score += 0.1; // +10% for Age
    }

    // F. Penalties
    if (isSuspicious) {
        score = 0.1; // Hard cap for phishing
        result.domainAge = 'new';
        result.hasDNSSEC = false;
    }

    // 5. FINALIZE
    result.trustScore = parseFloat(score.toFixed(1));

    if (result.trustScore >= 0.8) result.status = 'safe';
    else if (result.trustScore >= 0.5) result.status = 'caution';
    else result.status = 'unsafe';

    // Generate Explanations based on missing flags
    if (result.hasDNSSEC) result.details.push("DNSSEC Signature Verified");
    else result.details.push("Missing DNSSEC Signature");

    if (result.hasDANE) result.details.push("DANE Protocol Active");
    
    if (result.domainAge === 'new') result.details.push("Domain is recently registered (High Risk)");

    return result;
};