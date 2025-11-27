// src/data/trustedList.ts

// A hardcoded list of Nigeria's Critical Digital Infrastructure.
// In a production app, this would be a cryptographically signed JSON file downloaded periodically.
export const TRUSTED_DOMAINS: string[] = [
    // Federal Ministries & Bodies
    "firs.gov.ng",       // Tax
    "cbn.gov.ng",        // Central Bank
    "nimc.gov.ng",       // Identity (NIN)
    "immigration.gov.ng",// Passport
    "customs.gov.ng",    // Trade
    "police.gov.ng",     // Security
    "jamb.gov.ng",       // Education
    "ncdc.gov.ng",       // Health
    "cac.gov.ng",        // Business Reg
    "statehouse.gov.ng", // Presidency
    "budgetoffice.gov.ng",

    // State Government Services
    "lagosstate.gov.ng",
    "fct.gov.ng",
    
    // Financial/Infrastructure
    "remita.net",        // Govt Payments
    "nipost.gov.ng",     // Post
    "nira.org.ng",       // The Registry itself (Important!)
    
    // Education
    "noun.edu.ng",
    "unilag.edu.ng",
    "abu.edu.ng"
];

// A helper function to check if a domain is in our "Safe List"
export const isOfflineTrusted = (rawDomain: string): boolean => {
    // Clean up the domain (remove www.) to match our list
    const clean = rawDomain.toLowerCase().replace('www.', '');
    return TRUSTED_DOMAINS.includes(clean);
};