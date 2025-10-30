@echo off
echo ========================================
echo    RaaS Simulation - Production Mode
echo ========================================
echo.

echo [1/3] Initializing database...
node src/backend/db_init_sqlite.js
echo.

echo [2/3] Seeding database...
node src/backend/seed_data_sqlite.js
echo.

echo [3/3] Starting production server...
echo Server running at: http://localhost:3000
echo.
npm start

pause