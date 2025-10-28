// Initializes MySQL database with required tables
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'ns48@vit',
  database: process.env.DB_NAME || 'raas_simulation'
};

async function runMigrations(connection) {
  try {
    // Create logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        victim VARCHAR(255),
        amount DECIMAL(10,4) NOT NULL,
        paid BOOLEAN NOT NULL DEFAULT FALSE,
        campaign_id VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP NULL
      )
    `);

    // Create campaigns table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sector VARCHAR(100),
        size VARCHAR(50),
        amount DECIMAL(10,4),
        deadline INT,
        encryption_method VARCHAR(50),
        affiliate_id VARCHAR(100),
        status ENUM('active', 'paused', 'completed', 'stopped') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create affiliates table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS affiliates (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        success_rate DECIMAL(5,2) DEFAULT 0.00,
        total_campaigns INT DEFAULT 0,
        total_revenue DECIMAL(10,4) DEFAULT 0.00,
        status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function main() {
  let connection;
  try {
    // First connect without database to create it if it doesn't exist
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    
    const tempConnection = await mysql.createConnection(tempConfig);
    await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await tempConnection.end();

    // Now connect to the specific database
    connection = await mysql.createConnection(dbConfig);
    await runMigrations(connection);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  main();
}
