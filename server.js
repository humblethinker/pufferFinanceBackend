require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");


const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

const INFURA_PROJECT_ID = process.env.INFURA_API_KEY;
const provider = new ethers.providers.InfuraProvider(
  "mainnet",
  INFURA_PROJECT_ID
);

const dbPath = path.resolve(__dirname, "contractData.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS contract_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        totalAssets TEXT,
        totalSupply TEXT,
        result TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
  }
});

const contractAddress = "0xd9a442856c234a39a81a089c06451ebaa4306a72";
const abi = [
  "function totalAssets() view returns (uint256)",
  "function totalSupply() view returns (uint256)",
];
const contract = new ethers.Contract(contractAddress, abi, provider);

provider.on("block", async () => {
  try {
    const totalAssets = await contract.totalAssets();
    const totalSupply = await contract.totalSupply();
    const result = totalAssets / totalSupply;

    db.run(
      `INSERT INTO contract_data (totalAssets, totalSupply, result) VALUES (?, ?, ?)`,
      [totalAssets.toString(), totalSupply.toString(), result.toString()],
      function (err) {
        if (err) {
          console.error("Error inserting data into database:", err.message);
        } else {
          console.log(
            "New data saved with timestamp:",
            new Date().toISOString()
          );
        }
      }
    );
  } catch (error) {
    console.error("Error handling block event:", error);
  }
});

app.get("/contract-history", (req, res) => {
  db.all(
    `SELECT * FROM contract_data ORDER BY timestamp DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Error fetching data from database:", err.message);
        res.status(500).json({ error: "Error fetching data from database" });
      } else {
        res.json(rows);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
