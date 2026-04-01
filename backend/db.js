const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL. Create backend/.env and set DATABASE_URL before starting the server.",
  );
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;