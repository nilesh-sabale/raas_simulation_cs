import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkDatabase() {
    try {
        const db = await open({
            filename: path.join(__dirname, 'raas.db'),
            driver: sqlite3.Database
        });

        console.log('Connected to database...');

        // Check tables
        const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('Tables:', tables);

        // Check data
        if (tables.some(t => t.name === 'campaigns')) {
            const campaigns = await db.all('SELECT COUNT(*) as count FROM campaigns');
            console.log('Campaigns count:', campaigns[0].count);
        }

        if (tables.some(t => t.name === 'payments')) {
            const payments = await db.all('SELECT COUNT(*) as count FROM payments');
            console.log('Payments count:', payments[0].count);
        }

        await db.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkDatabase();