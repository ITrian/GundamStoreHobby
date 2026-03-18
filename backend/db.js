const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://gundamstorehobby_user:YIDxay1FAMdziM2acZJFC9Iwz6TgMicg@dpg-d6hhf33uibrs739vhhr0-a.singapore-postgres.render.com/gundamstorehobby",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;