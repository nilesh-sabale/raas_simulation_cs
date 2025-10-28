# RaaS Simulation (Educational Only)

A safe, non-malicious, educational simulation of Ransomware-as-a-Service (RaaS) using Node.js, Express, and SQLite. This project does NOT perform real ransomware activity. It simply demonstrates concepts using reversible encodings on dummy text.

## Features
- Dashboard for affiliates/developers with summary stats
- Fake encryption (Base64 or Caesar cipher) for uploaded text files
- Decrypt back to original content
- Payment simulation (create and mark fake payments)
- Logs page recording simulated events

## Tech Stack
- Node.js + Express (backend)
- SQLite (via sqlite3)
- HTML/CSS/vanilla JS (frontend)

## Quick Start

```bash
npm install
npm run init-db
npm start
```

Then open http://localhost:3000 in your browser.

## Project Structure
```
raas-simulation/
├── backend/
│   ├── server.js
│   ├── encryption.js
│   └── db_init.js
├── public/
│   ├── index.html
│   ├── dashboard.html
│   ├── upload.html
│   ├── logs.html
│   ├── about.html
│   ├── style.css
│   └── script.js
├── package.json
└── README.md
```

## Educational, Legal, and Ethical Disclaimer
- This project is for academic learning and demonstration only.
- It does not encrypt real files or cause damage.
- Do not use this for any illegal purpose. You are solely responsible for how you use this code.

## Notes
- Upload only small, dummy text files for the simulation.
- All content stays local. No network calls or real payments are made.
