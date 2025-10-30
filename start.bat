@echo off
echo ========================================
echo    RaaS Simulation - Enhanced Version
echo ========================================
echo.

echo [1/5] Installing dependencies...
call npm install
echo.

echo [2/5] Initializing SQLite database...
node src/backend/db_init_sqlite.js
echo.

echo [3/5] Seeding database with dummy data...
node src/backend/seed_data_sqlite.js
echo.

echo [4/5] Starting backend server...
start "Backend Server" cmd /k "node src/backend/server_sqlite.js"
echo Backend server starting at http://localhost:3000
echo.

echo [5/5] Starting frontend development server...
echo Frontend will be available at http://localhost:5173
echo.
echo ========================================
echo   Both servers are now running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo ========================================
echo.
npm run dev

pause