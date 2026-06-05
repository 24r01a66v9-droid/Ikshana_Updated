const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'ikshana.db');
const db = new Database(dbPath);

console.log("Checking tables in ikshana.db...");
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("Tables found:", tables.map(t => t.name).join(', '));

for (const table of tables) {
  if (table.name.startsWith('sqlite_')) continue;
  try {
    const count = db.prepare(`SELECT count(*) as count FROM ${table.name}`).all()[0].count;
    console.log(`Table ${table.name}: ${count} rows`);
    if (count > 0) {
      const sample = db.prepare(`SELECT * FROM ${table.name} LIMIT 1`).all()[0];
      console.log(`Sample row from ${table.name}:`, JSON.stringify(sample));
    }
  } catch (e) {
    console.log(`Error reading table ${table.name}:`, e.message);
  }
}

db.close();
