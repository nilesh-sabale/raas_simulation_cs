import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        // Open SQLite database
        const db = await open({
            filename: path.join(__dirname, 'raas.db'),
            driver: sqlite3.Database
        });

        console.log('Connected to SQLite database...');

        // Create tables
        console.log('Creating tables...');
        await db.exec(`
            CREATE TABLE IF NOT EXISTS affiliates (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                success_rate REAL DEFAULT 0,
                total_campaigns INTEGER DEFAULT 0,
                total_revenue REAL DEFAULT 0,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS campaigns (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                sector TEXT,
                size TEXT,
                amount REAL,
                deadline INTEGER,
                encryption_method TEXT,
                affiliate_id TEXT,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (affiliate_id) REFERENCES affiliates(id)
            );

            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                victim TEXT NOT NULL,
                amount REAL NOT NULL,
                paid BOOLEAN DEFAULT FALSE,
                address TEXT,
                campaign_id TEXT,
                paid_at DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
            );

            CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Database tables created successfully!');
        await db.close();

    } catch (error) {
        console.error('❌ Error initializing database:', error);
    }
}

// Run if this file is executed directly
console.log('Script starting...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);
initDatabase();

export { initDatabase };