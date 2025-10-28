# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an educational simulation of Ransomware-as-a-Service (RaaS) using Node.js, Express, and SQLite. It's designed for academic purposes and does NOT perform real ransomware activity - only reversible encoding demonstrations.

## Common Development Commands

### Initial Setup
```bash
npm install
npm run init-db
```

### Development Server
```bash
npm start
# Server runs on http://localhost:3000
```

### Database Operations
```bash
npm run init-db  # Initialize or recreate SQLite database
```

## Architecture

### Backend Structure (`/backend/`)
- **server.js**: Main Express server with REST API endpoints
  - Handles file encryption simulation, payment tracking, logs, and statistics
  - Uses in-memory file upload via multer
  - Database operations use callback-style SQLite3
- **encryption.js**: Simple encoding utilities (Base64 and Caesar cipher)
- **db_init.js**: Database schema initialization with two main tables: `logs` and `payments`

### Frontend Structure (`/public/`)
- Static HTML pages with vanilla JavaScript
- **script.js**: Shared utilities for API calls, DOM manipulation, and form handling
- Pages: index.html (home), dashboard.html (stats), upload.html (encryption demo), logs.html (event history), about.html

### Key Data Flow
1. File upload → encoding simulation → payment demand creation → event logging
2. Dashboard fetches aggregated statistics from database
3. All "encryption" operations are reversible for educational safety

## API Endpoints

### Core Functionality
- `POST /api/encrypt`: Upload file for encoding simulation
- `POST /api/decrypt`: Decode previously encoded content
- `GET /api/stats`: Dashboard statistics (attacks, payments, victims)
- `GET /api/logs`: Event history for monitoring

### Payment Simulation
- `POST /api/payment/create`: Create fake payment demand
- `POST /api/payment/mark-paid`: Mark simulated payment as completed

## Development Notes

### Database Schema
- SQLite database (`raas.db`) with two tables: `logs` (events) and `payments` (ransom tracking)
- Uses SQLite3 callback-style operations throughout
- Database path: project root (`../raas.db` relative to backend)

### Security Considerations
- This is educational software with no real security implementations
- Uses simple, reversible encoding methods only
- All payment operations are simulated with fake addresses

### File Processing
- Only processes text files via multer memory storage
- Content is converted to UTF-8 strings before encoding
- No persistent file storage - everything processed in memory