import path from 'path';
import express from 'express';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Server } from 'socket.io';
import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import { base64Encode, base64Decode, caesarEncode, caesarDecode } from './encryption.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    pingTimeout: 30000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
});

let PORT = Number(process.env.PORT || 3000);

// SQLite database connection
let db;

async function initDb() {
    db = await open({
        filename: path.join(__dirname, 'raas.db'),
        driver: sqlite3.Database
    });
    console.log('Connected to SQLite database');
}

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Enhanced stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const [
            totalCampaigns,
            activeCampaigns,
            totalPayments,
            paidPayments,
            totalRevenue,
            recentLogs
        ] = await Promise.all([
            db.get('SELECT COUNT(*) as count FROM campaigns'),
            db.get('SELECT COUNT(*) as count FROM campaigns WHERE status = "active"'),
            db.get('SELECT COUNT(*) as count FROM payments'),
            db.get('SELECT COUNT(*) as count FROM payments WHERE paid = 1'),
            db.get('SELECT SUM(amount) as total FROM payments WHERE paid = 1'),
            db.all('SELECT * FROM logs ORDER BY created_at DESC LIMIT 10')
        ]);

        const stats = {
            totalCampaigns: totalCampaigns.count,
            activeCampaigns: activeCampaigns.count,
            totalPayments: totalPayments.count,
            paidPayments: paidPayments.count,
            totalRevenue: parseFloat((totalRevenue.total || 0).toFixed(4)),
            successRate: totalPayments.count > 0 ? ((paidPayments.count / totalPayments.count) * 100).toFixed(1) : '0',
            recentActivity: recentLogs,
            // Additional realistic metrics
            pendingPayments: totalPayments.count - paidPayments.count,
            conversionRate: totalPayments.count > 0 ? ((paidPayments.count / totalPayments.count) * 100).toFixed(1) : '0',
            avgPaymentAmount: totalPayments.count > 0 ? ((totalRevenue.total || 0) / paidPayments.count).toFixed(4) : '0',
            totalTargets: Math.floor(Math.random() * 500) + 200,
            activeTargets: Math.floor(Math.random() * 100) + 50,
            networkUptime: '99.8%',
            lastUpdate: new Date().toISOString()
        };

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Payments endpoint
app.get('/api/payments', async (req, res) => {
    try {
        const payments = await db.all(`
      SELECT p.*, c.name as campaign_name 
      FROM payments p 
      LEFT JOIN campaigns c ON p.campaign_id = c.id 
      ORDER BY p.created_at DESC
    `);
        res.json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
});

// Campaigns endpoint
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await db.all(`
      SELECT c.*, a.name as affiliate_name 
      FROM campaigns c 
      LEFT JOIN affiliates a ON c.affiliate_id = a.id 
      ORDER BY c.created_at DESC
    `);
        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
});

// Create campaign endpoint
app.post('/api/campaigns', async (req, res) => {
    try {
        const { name, description, sector, size, amount, deadline, encryption_method } = req.body;
        const id = uuidv4();

        await db.run(
            'INSERT INTO campaigns (id, name, description, sector, size, amount, deadline, encryption_method, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, name, description, sector, size, amount, deadline, encryption_method, 'active']
        );

        // Log the activity
        await db.run(
            'INSERT INTO logs (type, message) VALUES (?, ?)',
            ['campaign', `New campaign "${name}" created for ${sector} sector`]
        );

        io.emit('campaignCreated', { id, name, description, sector, size, amount, deadline, encryption_method, status: 'active' });
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error creating campaign:', error);
        res.status(500).json({ error: 'Failed to create campaign' });
    }
});

// Logs endpoint
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await db.all('SELECT * FROM logs ORDER BY created_at DESC LIMIT 100');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Failed to fetch logs' });
    }
});

// Affiliates endpoint
app.get('/api/affiliates', async (req, res) => {
    try {
        const affiliates = await db.all('SELECT * FROM affiliates ORDER BY total_revenue DESC');
        res.json(affiliates);
    } catch (error) {
        console.error('Error fetching affiliates:', error);
        res.status(500).json({ error: 'Failed to fetch affiliates' });
    }
});

// File encryption endpoint
app.post('/api/encrypt', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { method } = req.body;
        const fileContent = req.file.buffer.toString('utf8');
        let encryptedContent;
        let key = '';

        if (method === 'base64') {
            encryptedContent = base64Encode(fileContent);
        } else if (method === 'caesar') {
            const shift = Math.floor(Math.random() * 25) + 1;
            encryptedContent = caesarEncode(fileContent, shift);
            key = shift.toString();
        } else {
            return res.status(400).json({ error: 'Invalid encryption method' });
        }

        // Log the encryption
        await db.run(
            'INSERT INTO logs (type, message) VALUES (?, ?)',
            ['encrypt', `File "${req.file.originalname}" encrypted using ${method.toUpperCase()} method`]
        );

        io.emit('fileEncrypted', {
            filename: req.file.originalname,
            method: method.toUpperCase(),
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            filename: req.file.originalname,
            encryptedContent,
            method: method.toUpperCase(),
            key: key || 'N/A'
        });
    } catch (error) {
        console.error('Error encrypting file:', error);
        res.status(500).json({ error: 'Failed to encrypt file' });
    }
});

// File decryption endpoint
app.post('/api/decrypt', async (req, res) => {
    try {
        const { content, method, key } = req.body;
        let decryptedContent;

        if (method === 'BASE64') {
            decryptedContent = base64Decode(content);
        } else if (method === 'CAESAR') {
            const shift = parseInt(key);
            if (isNaN(shift)) {
                return res.status(400).json({ error: 'Invalid key for Caesar cipher' });
            }
            decryptedContent = caesarDecode(content, shift);
        } else {
            return res.status(400).json({ error: 'Invalid decryption method' });
        }

        // Log the decryption
        await db.run(
            'INSERT INTO logs (type, message) VALUES (?, ?)',
            ['decrypt', `File decrypted using ${method} method`]
        );

        io.emit('fileDecrypted', {
            method,
            timestamp: new Date().toISOString()
        });

        res.json({
            success: true,
            decryptedContent,
            method
        });
    } catch (error) {
        console.error('Error decrypting file:', error);
        res.status(500).json({ error: 'Failed to decrypt file' });
    }
});

// Mark payment as paid
app.post('/api/payments/:id/pay', async (req, res) => {
    try {
        const { id } = req.params;

        await db.run(
            'UPDATE payments SET paid = 1, paid_at = ? WHERE id = ?',
            [new Date().toISOString(), id]
        );

        const payment = await db.get('SELECT * FROM payments WHERE id = ?', [id]);

        // Log the payment
        await db.run(
            'INSERT INTO logs (type, message) VALUES (?, ?)',
            ['payment_paid', `Payment received from ${payment.victim}: ${payment.amount} BTC`]
        );

        io.emit('paymentReceived', payment);
        res.json({ success: true });
    } catch (error) {
        console.error('Error marking payment as paid:', error);
        res.status(500).json({ error: 'Failed to mark payment as paid' });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Start server
async function startServer() {
    await initDb();

    // Check if port is in use and find available port
    const checkPort = (port) => {
        return new Promise((resolve) => {
            const testServer = server.listen(port, () => {
                testServer.close(() => resolve(true));
            }).on('error', () => resolve(false));
        });
    };

    while (!(await checkPort(PORT))) {
        PORT++;
    }

    server.listen(PORT, () => {
        console.log(`RaaS educational simulation running on http://localhost:${PORT}`);
        console.log('Socket.IO server initialized');
    });
}

startServer().catch(console.error);