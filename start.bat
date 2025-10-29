@echo off
echo ========================================
echo    RaaS Simulation - Enhanced Version
echo ========================================
echo.

echo [1/4] Initializing SQLite database...
node src/backend/db_init_sqlite.js
echo.

echo [2/4] Seeding database with dummy data...
node src/backend/seed_data_sqlite.js
echo.

echo [3/4] Building frontend application...
npm run build
echo.

echo [4/4] Starting development servers...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000
echo.
npm run dev

pause