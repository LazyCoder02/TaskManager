const fs = require('fs').promises;
const path = require('path');
const db = require('../config/database');

async function executeSqlFile(filePath) {
  try {
    const sql = await fs.readFile(filePath, 'utf8');
    await db.query(sql);
    console.log(`Successfully executed ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`Error executing ${path.basename(filePath)}:`, error);
    throw error;
  }
}

async function initializeDatabase() {
  if (process.env.RUN_MIGRATIONS !== 'true') {
      console.log('Skipping database initialization (RUN_MIGRATIONS is not set to true)');
      return;
    }

  try {
    console.log('Starting database initialization...');
    const migrationPath = path.join(__dirname, '../migrations/init.sql');
    await executeSqlFile(migrationPath);
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = { initializeDatabase };