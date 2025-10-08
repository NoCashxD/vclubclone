const mysql = require('mysql');

// MySQL connection
const db = mysql.createPool({
  connectionLimit: 10,
  host: "srv1750.hstgr.io",
  user: "u679703987_vclub",
  password: "1973Waheguru!",
  database: "u679703987_vclub",
  connectTimeout: 30000
});

// Migration queries
const migrationQueries = [
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS resetPasswordToken VARCHAR(255) NULL",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS resetPasswordExpires DATETIME NULL",
  "CREATE INDEX IF NOT EXISTS idx_reset_token ON users(resetPasswordToken)",
  "ALTER TABLE users ADD COLUMN IF NOT EXISTS refund INT DEFAULT 100",
  "UPDATE users SET refund = 100 WHERE refund IS NULL OR refund = 0"
];

async function runMigration() {
  console.log('Starting database migration...');
  
  for (let i = 0; i < migrationQueries.length; i++) {
    const query = migrationQueries[i];
    console.log(`Running query ${i + 1}: ${query}`);
    
    try {
      await new Promise((resolve, reject) => {
        db.query(query, (err, results) => {
          if (err) {
            console.error(`Error running query ${i + 1}:`, err);
            reject(err);
          } else {
            console.log(`Query ${i + 1} completed successfully`);
            resolve(results);
          }
        });
      });
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  }
  
  console.log('Migration completed successfully!');
  process.exit(0);
}

runMigration(); 