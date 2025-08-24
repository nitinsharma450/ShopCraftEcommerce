
import mysql from 'mysql2/promise'


export var db; 
try {
  db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "social",
    password: "Nitin@9811",
  });
  console.log("Connected to database");
} catch (error) {
  console.log("Unable to connect database");
}
