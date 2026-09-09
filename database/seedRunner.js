const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function runSeed() {
  const dbName = process.env.DB_NAME || 'mobilya_db';
  const config = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };

  console.log('🔄 Checking PostgreSQL connection and database existence...');
  const rootClient = new Client({ ...config, database: 'postgres' });
  
  try {
    await rootClient.connect();
    // Check if database exists
    const res = await rootClient.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    if (res.rowCount === 0) {
      console.log(`📦 Database "${dbName}" does not exist. Creating it now...`);
      await rootClient.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Database "${dbName}" created successfully!`);
    } else {
      console.log(`ℹ️ Database "${dbName}" already exists.`);
    }
  } catch (err) {
    console.error('⚠️ Could not connect to default postgres database:', err.message);
  } finally {
    await rootClient.end();
  }

  // Connect to target database and run schema + seed
  console.log(`🚀 Connecting to "${dbName}" to apply schema and seed data...`);
  const appClient = new Client({ ...config, database: dbName });
  
  try {
    await appClient.connect();
    
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('📜 Executing schema.sql...');
    await appClient.query(schemaSql);
    console.log('✅ Schema tables created successfully!');

    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    console.log('🌱 Executing seed.sql...');
    await appClient.query(seedSql);
    console.log('✅ Seed data imported successfully!');

    console.log('🎉 Database initialization complete!');
  } catch (err) {
    console.error('❌ Error executing database scripts:', err.message);
  } finally {
    await appClient.end();
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;
