const path = require('path');
const express = require('express');
const multer = require('multer');
const mysql = require('mysql2/promise');
const { base64Encode, base64Decode, caesarEncode, caesarDecode } = require('./encryption');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ns48@vit',
  database: process.env.DB_NAME || 'raas_simulation'
};

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

async function withDb(cb) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    return await cb(connection);
  } finally {
    await connection.end();
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
      const [rows] = await connection.execute('SELECT * FROM payments ORDER BY created_at DESC, id DESC LIMIT 200');
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
    const paymentId = await withDb(async (connection) => {
      const [result] = await connection.execute('INSERT INTO payments (victim, amount) VALUES (?, ?)', ['demo_victim', amount]);
      return result.insertId;
    });
    await logEvent('encrypt', `File encrypted using ${method}; payment #${paymentId} demanded = ${amount}`);
    res.json({ method, encoded, ransom: { payment_id: paymentId, amount, address: `FAKE-CRYPTO-ADDRESS-${paymentId}` } });
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

app.listen(PORT, () => {
  console.log(`RaaS educational simulation running on http://localhost:${PORT}`);
});
