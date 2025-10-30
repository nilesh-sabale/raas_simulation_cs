import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'raas'
};

async function seedDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database for seeding...');

        // Clear existing data
        await connection.execute('DELETE FROM logs');
        await connection.execute('DELETE FROM payments');
        await connection.execute('DELETE FROM campaigns');
        await connection.execute('DELETE FROM affiliates');

        // Seed affiliates
        const affiliates = [
            { id: uuidv4(), name: 'Shadow_Broker', success_rate: 85.5, total_campaigns: 12, total_revenue: 2.4567 },
            { id: uuidv4(), name: 'CyberPhantom', success_rate: 92.3, total_campaigns: 8, total_revenue: 1.8934 },
            { id: uuidv4(), name: 'DarkNet_King', success_rate: 78.9, total_campaigns: 15, total_revenue: 3.2145 },
            { id: uuidv4(), name: 'Ghost_Hacker', success_rate: 88.7, total_campaigns: 10, total_revenue: 2.1098 }
        ];

        for (const affiliate of affiliates) {
            await connection.execute(
                'INSERT INTO affiliates (id, name, success_rate, total_campaigns, total_revenue, status) VALUES (?, ?, ?, ?, ?, ?)',
                [affiliate.id, affiliate.name, affiliate.success_rate, affiliate.total_campaigns, affiliate.total_revenue, 'active']
            );
        }

        // Seed campaigns
        const campaigns = [
            {
                id: uuidv4(),
                name: 'Operation Blackout',
                description: 'Targeting healthcare systems with advanced encryption methods',
                sector: 'Healthcare',
                size: '50',
                amount: 0.15,
                deadline: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days from now
                encryption_method: 'AES-256',
                affiliate_id: affiliates[0].id,
                status: 'active'
            },
            {
                id: uuidv4(),
                name: 'Corporate Takedown',
                description: 'Multi-vector attack on financial institutions',
                sector: 'Finance',
                size: '25',
                amount: 0.25,
                deadline: Date.now() + (5 * 24 * 60 * 60 * 1000),
                encryption_method: 'RSA-2048',
                affiliate_id: affiliates[1].id,
                status: 'active'
            },
            {
                id: uuidv4(),
                name: 'EduCrypt Initiative',
                description: 'Educational sector penetration testing simulation',
                sector: 'Education',
                size: '75',
                amount: 0.08,
                deadline: Date.now() + (10 * 24 * 60 * 60 * 1000),
                encryption_method: 'ChaCha20',
                affiliate_id: affiliates[2].id,
                status: 'paused'
            },
            {
                id: uuidv4(),
                name: 'Industrial Disruption',
                description: 'Manufacturing systems vulnerability assessment',
                sector: 'Manufacturing',
                size: '30',
                amount: 0.20,
                deadline: Date.now() + (3 * 24 * 60 * 60 * 1000),
                encryption_method: 'Blowfish',
                affiliate_id: affiliates[3].id,
                status: 'completed'
            }
        ];

        for (const campaign of campaigns) {
            await connection.execute(
                'INSERT INTO campaigns (id, name, description, sector, size, amount, deadline, encryption_method, affiliate_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [campaign.id, campaign.name, campaign.description, campaign.sector, campaign.size, campaign.amount, campaign.deadline, campaign.encryption_method, campaign.affiliate_id, campaign.status]
            );
        }

        // Seed payments
        const payments = [
            { victim: 'victim-001-healthcare', amount: 0.15, paid: true, campaign_id: campaigns[0].id },
            { victim: 'victim-002-finance', amount: 0.25, paid: true, campaign_id: campaigns[1].id },
            { victim: 'victim-003-education', amount: 0.08, paid: false, campaign_id: campaigns[2].id },
            { victim: 'victim-004-manufacturing', amount: 0.20, paid: true, campaign_id: campaigns[3].id },
            { victim: 'victim-005-healthcare', amount: 0.12, paid: false, campaign_id: campaigns[0].id },
            { victim: 'victim-006-finance', amount: 0.18, paid: true, campaign_id: campaigns[1].id },
            { victim: 'victim-007-retail', amount: 0.09, paid: false, campaign_id: null },
            { victim: 'victim-008-tech', amount: 0.22, paid: true, campaign_id: null }
        ];

        for (const payment of payments) {
            const [result] = await connection.execute(
                'INSERT INTO payments (victim, amount, paid, campaign_id, paid_at) VALUES (?, ?, ?, ?, ?)',
                [payment.victim, payment.amount, payment.paid, payment.campaign_id, payment.paid ? new Date() : null]
            );

            // Add address for each payment
            await connection.execute(
                'UPDATE payments SET address = ? WHERE id = ?',
                [`FAKE-CRYPTO-ADDRESS-${result.insertId}`, result.insertId]
            );
        }

        // Seed activity logs
        const logTypes = ['encrypt', 'decrypt', 'payment_create', 'payment_paid', 'campaign'];
        const logMessages = [
            'File encrypted using AES-256 encryption method',
            'Payment demand created for victim-001-healthcare',
            'Campaign Operation Blackout launched successfully',
            'Decryption key provided after payment confirmation',
            'New affiliate Shadow_Broker registered in system',
            'Payment received from victim-002-finance: 0.25 BTC',
            'Encryption simulation completed on 15 files',
            'Campaign Corporate Takedown status updated to active',
            'Payment #3 marked as paid by victim-004-manufacturing',
            'File decryption completed for victim-006-finance',
            'New campaign EduCrypt Initiative created',
            'Affiliate CyberPhantom updated success rate to 92.3%',
            'Payment demand expired for victim-007-retail',
            'Campaign Industrial Disruption completed successfully',
            'Encryption method updated to ChaCha20 for security'
        ];

        for (let i = 0; i < 25; i++) {
            const randomType = logTypes[Math.floor(Math.random() * logTypes.length)];
            const randomMessage = logMessages[Math.floor(Math.random() * logMessages.length)];
            const randomDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Random date within last 7 days

            await connection.execute(
                'INSERT INTO logs (type, message, created_at) VALUES (?, ?, ?)',
                [randomType, randomMessage, randomDate]
            );
        }

        console.log('✅ Database seeded successfully with dummy data!');
        console.log('📊 Added:');
        console.log(`   - ${affiliates.length} affiliates`);
        console.log(`   - ${campaigns.length} campaigns`);
        console.log(`   - ${payments.length} payments`);
        console.log('   - 25 activity logs');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    seedDatabase();
}

export { seedDatabase };