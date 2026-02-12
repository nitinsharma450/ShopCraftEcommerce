import mysql from "mysql2/promise";

export let db;

async function connectWithRetry() {
  try {
    db = await mysql.createConnection({
      host: "mysql",
      user: "root",
      password: "Nitin@9811",
      database: "social",
      port: 3306,
    });

    console.log("✅ Connected to database");
  } catch (err) {
    console.log("❌ Database not ready, retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000);
  }
}

connectWithRetry();
