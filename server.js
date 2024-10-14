require("dotenv").config();
const express = require("express");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect((err) => {
  if (err) {
    console.error("Connection error:", err.stack);
  } else {
    console.log("Connected to PostgreSQL");
  }
});

app.get("/contract-history", (req, res) => {
  const query = `SELECT * FROM contract_data ORDER BY timestamp DESC`;
  client.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching data from database:", err.stack);
      res.status(500).json({ error: "Error fetching data from database" });
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
