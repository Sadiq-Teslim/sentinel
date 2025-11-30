# 🛡️ Sentinel — The .ng Trust Anchor

![Status](https://img.shields.io/badge/Status-Hackathon_MVP-green) ![Tech](https://img.shields.io/badge/Tech-React_PWA_%7C_TypeScript_%7C_YarnGPT-blue) ![Theme](https://img.shields.io/badge/Focus-Cybersecurity_%26_Inclusion-orange)

A voice-first, offline-capable frontend that helps Nigerian internet users verify websites using DNSSEC, language-local audio alerts, and a lightweight trust cache.

Live demo: [https://use-sentinel.vercel.app](https://use-sentinel.vercel.app)

---

## Problem Statement

Two core gaps make online fraud and exclusion worse in Nigeria:

- The Trust Gap: cryptographic protections (DNSSEC) are invisible to most users — they can't tell real government sites from lookalikes.
- The Exclusion Gap: verification tools are text-heavy and English-first, leaving non-English speakers and low-literacy users behind.

Sentinel addresses both by combining automated trust signals with voice alerts in Hausa, Yoruba and Igbo.

---

## What it does (high level)

- Real-time domain analysis (DNSSEC, DANE/TLS checks, domain metadata).
- Voice-first feedback via YarnGPT in multiple local languages.
- Offline-first experience with a signed local trust cache.
- Verifiable credentials (local, cryptographically anchored) and delegation for trusted agents.

---

## Key Features

- DNSSEC + TLS validation
- Multilingual audio alerts (Hausa, Yoruba, Igbo)
- Offline trust cache for critical government nodes
- Local verifiable credentials (VC) stored in IndexedDB
- Delegation tokens and audit logs for proxy verification

---

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- AI audio: YarnGPT (pre-generated assets cached for offline)
- PWA-ready with service worker + offline cache
- Deployment: Vercel

---

## Run locally

1. Clone the repo

```cmd
git clone https://github.com/Sadiq-Teslim/sentinel.git
cd sentinel
```

1. Install dependencies

```cmd
npm install
```

1. Run the dev server

```cmd
npm run dev
```

1. Open the app

Visit [http://localhost:5173](http://localhost:5173) (or the URL shown by the dev server). To test offline mode, open DevTools → Network → Offline.

---

## Common troubleshooting

- If components look unstyled: ensure Tailwind is installed and the dev server has processed CSS. If you changed `src/index.css`, restore the Tailwind directives and run the dev server again.
- If audio generation fails: check `generate_audio.js` logs and verify your YarnGPT API key is configured. The script also writes placeholders to `public/audio` when the API fails.

---

## Team

- Ramat — Product Manager & Team Lead
- Sadiq Teslim — Lead Full-Stack Engineer
- Imoru Abdul-Samad — Cybersecurity Lead

---

Built with ❤️ for the NKF NiRA-XT Hackathon II.

---

## Notes for Judges

- Accessibility: voice-first UI with multilingual audio (Hausa, Yoruba, Igbo) and high-contrast, mobile-first layout.
- Impact: focuses on real, measurable risk reduction by surfacing DNSSEC + TLS signals and a signed offline trust cache for critical government services.
- Offline: PWA-ready with service worker caching for offline verification and pre-generated audio assets for degraded networks.
- Privacy & Security: stores verifiable credentials locally (IndexedDB) and does not rely on a central database for user identity.

If you'd like, I can add a short demo script and a small checklist tailored for judges (screens to show, requests to run, and sample domains to test).
