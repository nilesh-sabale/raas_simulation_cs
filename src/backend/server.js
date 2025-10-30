import path from 'path';
import express from 'express';
import multer from 'multer';
import mysql from 'mysql2/promise';
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

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'raas'
};

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Database connection pool for better performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
});

async function withDb(cb) {
  const connection = await pool.getConnection();
  try {
    return await cb(connection);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    connection.release();
  }
}

async function logEvent(type, message) {
  await withDb(async (connection) => {
    await connection.execute('INSERT INTO logs (type, message) VALUES (?, ?)', [type, message]);
  });
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await withDb(async (connection) => {
      const [encryptRows] = await connection.execute("SELECT COUNT(*) as total FROM logs WHERE type = 'encrypt'");
      const [paidRows] = await connection.execute("SELECT COUNT(*) as paid FROM payments WHERE paid = 1");
      const [victimRows] = await connection.execute("SELECT COUNT(DISTINCT victim) as victims FROM payments");

      return {
        total_attacks: encryptRows[0]?.total || 0,
        payments_made: paidRows[0]?.paid || 0,
        fake_victims: victimRows[0]?.victims || 0,
        affiliates: Math.max(1, Math.floor((encryptRows[0]?.total || 0) / 3)),
        developers: 1 // static for demo
      };
    });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await withDb(async (connection) => {
      const [rows] = await connection.execute('SELECT id, type, message, created_at FROM logs ORDER BY created_at DESC, id DESC LIMIT 200');
      return rows;
    });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await withDb(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT id, victim, amount, paid, campaign_id, created_at, paid_at,
               COALESCE(address, CONCAT('FAKE-CRYPTO-ADDRESS-', id)) as address
        FROM payments 
        ORDER BY created_at DESC, id DESC 
        LIMIT 200
      `);
      return rows;
    });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.post('/api/payment/create', async (req, res) => {
  const { victim = 'anonymous', amount = 0.01 } = req.body || {};
  try {
    const result = await withDb(async (connection) => {
      const [result] = await connection.execute('INSERT INTO payments (victim, amount) VALUES (?, ?)', [victim, amount]);
      return result.insertId;
    });
    await logEvent('payment_create', `Payment #${result} created for ${victim} amount ${amount}`);
    try { io.emit('payments-updated', { id: result, victim, amount, status: 'created' }); } catch { }
    res.json({ id: result, victim, amount, address: `FAKE-CRYPTO-ADDRESS-${result}` });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.post('/api/payment/mark-paid', async (req, res) => {
  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'missing_id' });
  try {
    await withDb(async (connection) => {
      await connection.execute("UPDATE payments SET paid = 1, paid_at = NOW() WHERE id = ?", [id]);
    });
    await logEvent('payment_paid', `Payment #${id} marked paid`);
    try { io.emit('payments-updated', { id, status: 'paid' }); } catch { }
    res.json({ id, paid: true });
  } catch (error) {
    console.error('Error marking payment as paid:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.post('/api/encrypt', upload.single('file'), async (req, res) => {
  const method = (req.body?.method || 'base64').toLowerCase();
  const shift = parseInt(req.body?.shift || '3', 10);
  if (!req.file) return res.status(400).json({ error: 'no_file' });

  const text = req.file.buffer.toString('utf8');
  let encoded;
  if (method === 'caesar') {
    encoded = caesarEncode(text, isNaN(shift) ? 3 : shift);
  } else {
    encoded = base64Encode(text);
  }

  // create a fake ransom demand
  const amount = (Math.random() * 0.05 + 0.01).toFixed(4);
  try {
    const victimId = req.headers['x-victim-id'] || 'demo_victim';
    const paymentId = await withDb(async (connection) => {
      const [result] = await connection.execute('INSERT INTO payments (victim, amount) VALUES (?, ?)', [victimId, amount]);
      return result.insertId;
    });
    await logEvent('encrypt', `File encrypted using ${method}; payment #${paymentId} demanded = ${amount}`);
    try { io.emit('payments-updated', { id: paymentId, victim: victimId, amount, status: 'created' }); } catch { }
    res.json({ method, encoded, ransom: { payment_id: paymentId, amount, address: `FAKE-CRYPTO-ADDRESS-${paymentId}`, victim: victimId } });
  } catch (error) {
    console.error('Error processing encryption:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

app.post('/api/decrypt', async (req, res) => {
  const { method = 'base64', content = '', shift = 3 } = req.body || {};
  let decoded;
  try {
    if (method.toLowerCase() === 'caesar') {
      decoded = caesarDecode(String(content), Number(shift) || 3);
    } else {
      decoded = base64Decode(String(content));
    }
  } catch (e) {
    return res.status(400).json({ error: 'decode_failed' });
  }
  await logEvent('decrypt', `Content decrypted using ${method}`);
  res.json({ decoded });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-dashboard', () => {
    socket.join('dashboard');
    console.log('Client joined dashboard room');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Enhanced API endpoints for campaigns
app.post('/api/campaigns/create', async (req, res) => {
  const { name, description, sector, size, amount, deadline, encryption, affiliate } = req.body;

  try {
    const campaignId = uuidv4();
    const result = await withDb(async (connection) => {
      await connection.execute(`
        INSERT INTO campaigns (id, name, description, sector, size, amount, deadline, encryption_method, affiliate_id, status, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW())
      `, [campaignId, name, description, sector, size, amount, deadline, encryption, affiliate]);
      return campaignId;
    });

    await logEvent('campaign_create', `Campaign ${name} created with ID ${campaignId}`);

    // Emit real-time update
    io.to('dashboard').emit('campaign-created', {
      id: campaignId,
      name,
      sector,
      status: 'active',
      affiliate_id: affiliate
    });

    res.json({ id: campaignId, success: true });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'campaign_creation_failed' });
  }
});

app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await withDb(async (connection) => {
      try {
        const [rows] = await connection.execute(`
          SELECT c.*, 
                 COUNT(p.id) as victim_count,
                 SUM(CASE WHEN p.paid = 1 THEN p.amount ELSE 0 END) as revenue
          FROM campaigns c
          LEFT JOIN payments p ON c.id = p.campaign_id
          GROUP BY c.id
          ORDER BY c.created_at DESC
        `);
        return rows;
      } catch (e) {
        // Fallback if campaign_id column doesn't exist yet
        const [rows] = await connection.execute(`
          SELECT c.*, 0 as victim_count, 0 as revenue
          FROM campaigns c
          ORDER BY c.created_at DESC
        `);
        return rows;
      }
    });
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

// Enhanced stats endpoint
app.get('/api/stats/enhanced', async (req, res) => {
  try {
    const stats = await withDb(async (connection) => {
      const [encryptRows] = await connection.execute("SELECT COUNT(*) as total FROM logs WHERE type = 'encrypt'");
      const [paidRows] = await connection.execute("SELECT COUNT(*) as paid FROM payments WHERE paid = 1");
      const [victimRows] = await connection.execute("SELECT COUNT(DISTINCT victim) as victims FROM payments");
      const [campaignRows] = await connection.execute("SELECT COUNT(*) as campaigns FROM campaigns WHERE status = 'active'");
      const [revenueRows] = await connection.execute("SELECT SUM(amount) as revenue FROM payments WHERE paid = 1");

      return {
        totalAttacks: encryptRows[0]?.total || 0,
        paymentsMade: paidRows[0]?.paid || 0,
        fakeVictims: victimRows[0]?.victims || 0,
        activeCampaigns: campaignRows[0]?.campaigns || 0,
        totalRevenue: parseFloat(revenueRows[0]?.revenue || 0),
        activeAffiliates: Math.max(1, Math.floor((encryptRows[0]?.total || 0) / 3)),
        developers: 1
      };
    });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching enhanced stats:', error);
    // Return fallback data if database is not available
    res.json({
      totalAttacks: 15,
      paymentsMade: 8,
      fakeVictims: 12,
      activeCampaigns: 3,
      totalRevenue: 1.2345,
      activeAffiliates: 4,
      developers: 1
    });
  }
});

// Real-time activity endpoint
app.get('/api/activity/live', async (req, res) => {
  try {
    const activities = await withDb(async (connection) => {
      const [rows] = await connection.execute(`
        SELECT type, message, created_at 
        FROM logs 
        ORDER BY created_at DESC 
        LIMIT 10
      `);
      return rows;
    });
    res.json(activities);
  } catch (error) {
    console.error('Error fetching live activity:', error);
    res.status(500).json({ error: 'db_error' });
  }
});

// Simulate real-time activity
setInterval(() => {
  const activities = [
    '[LIVE] Campaign Alpha launched targeting enterprise sector',
    '[LIVE] Payment received from victim-001: 0.05 BTC',
    '[LIVE] New affiliate registered: affiliate-042',
    '[LIVE] Encryption simulation completed on 15 files',
    '[LIVE] Network scan detected 3 new targets',
    '[LIVE] Decryption key generated for victim-023',
    '[LIVE] Revenue distribution updated for Q4',
    '[LIVE] Blue team simulation mode activated'
  ];

  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  io.to('dashboard').emit('live-activity', {
    message: randomActivity,
    timestamp: new Date().toISOString()
  });
}, 5000);

function tryListen(port, attemptsLeft = 10) {
  server.listen(port, () => {
    PORT = port;
    console.log(`RaaS educational simulation running on http://localhost:${PORT}`);
    console.log(`Socket.IO server initialized`);
  }).on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} in use, retrying on ${nextPort}...`);
      setTimeout(() => tryListen(nextPort, attemptsLeft - 1), 200);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

tryListen(PORT);
