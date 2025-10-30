# RaaS Simulation v2.0 (Educational Only)

A modern, safe, non-malicious educational simulation of Ransomware-as-a-Service (RaaS) built with React, TypeScript, and Node.js. This project does NOT perform real ransomware activity. It demonstrates cybersecurity concepts using reversible encodings on dummy text with a professional, interactive interface.

## ✨ Features
- **Modern React + TypeScript Frontend** - Professional, responsive UI with real-time updates
- **Interactive Landing Page** - Clear educational messaging and feature showcase
- **Real-time Dashboard** - Live statistics, charts, and activity monitoring
- **Campaign Management** - Simulation of RaaS campaign creation and tracking
- **Multi-role Experience** - Operator, affiliate, and victim perspectives
- **Network Visualization** - Interactive graphs showing attack patterns
- **Payment Simulation** - Fake cryptocurrency transactions and tracking
- **Activity Logging** - Comprehensive event tracking and monitoring
- **Blue Team Mode** - Defensive cybersecurity perspective
- **Mobile Responsive** - Works seamlessly across all devices

## 🚀 Tech Stack
- **Frontend**: React 18, TypeScript, Styled Components, Framer Motion
- **Backend**: Node.js + Express (unchanged for compatibility)
- **Database**: MySQL (via mysql2) for simulation data persistence
- **Build Tool**: Vite for fast development and optimized builds
- **Charts**: Recharts for interactive data visualization
- **Real-time**: Socket.IO for live updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL server (optional - app works without database)
- Modern web browser

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd raas-simulation
npm install
```

2. **Set up environment (optional):**
```bash
# Copy environment template
cp .env.example .env
# Edit .env with your MySQL credentials if using database
```

3. **Initialize database (optional):**
```bash
npm run init-db
```

4. **Start the application:**
```bash
# Development mode (runs both frontend and backend)
npm run dev

# Or run separately:
npm run client  # Frontend only (React dev server)
npm run server  # Backend only (Node.js API)
```

5. **Access the application:**
- **Landing Page**: http://localhost:5173
- **Dashboard**: http://localhost:5173/app
- **API**: http://localhost:3000/api

### Development Commands
```bash
npm run dev          # Start full development environment
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## 📁 Project Structure
```
raas-simulation/
├── src/                     # React TypeScript frontend
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Generic components (ErrorBoundary, Loading)
│   │   ├── layout/         # Layout components (Sidebar, Header)
│   │   └── charts/         # Chart components (coming soon)
│   ├── pages/              # Page components
│   │   ├── Landing/        # Landing page
│   │   ├── Dashboard/      # Main dashboard
│   │   ├── Campaigns/      # Campaign management
│   │   └── ...            # Other feature pages
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and WebSocket services
│   ├── store/              # State management (Zustand)
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── styles/             # Global styles and theme
├── backend/                # Node.js Express API (unchanged)
│   ├── server.js          # Express server and API routes
│   ├── encryption.js      # Encoding/decoding helpers
│   └── db_init.js         # Database initialization
├── public/                # Static assets
├── dist/                  # Production build output
└── package.json
```

## Educational, Legal, and Ethical Disclaimer
- This project is for academic learning and demonstration only.
- It does not encrypt real files or cause damage.
- Do not use this for any illegal purpose. You are solely responsible for how you use this code.

## Notes
- Upload only small, dummy text files for the simulation.
- All content stays local. No network calls or real payments are made.
