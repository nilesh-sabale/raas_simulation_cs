# MySQL Setup Guide

## Prerequisites
1. Install MySQL Server on your system
2. Make sure MySQL is running

## Database Configuration

Create a `.env` file in the project root with the following content:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=raas_simulation

# Server Configuration
PORT=3000
```

Replace `your_password_here` with your actual MySQL root password.

## Installation Steps

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run init-db
```

3. Start the server:
```bash
npm start
```

## Database Schema

The application will automatically create the following tables:
- `logs` - Stores simulation events and activities
- `payments` - Stores simulated payment records

## Troubleshooting

- Make sure MySQL is running on your system
- Verify your database credentials in the `.env` file
- Check that the database user has CREATE and INSERT permissions
- Ensure the database name `raas_simulation` doesn't already exist (or update the name in `.env`)
