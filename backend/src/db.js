const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  user: process.env.DB_USER || 'nestle',
  password: process.env.DB_PASSWORD || 'nestle',
  database: process.env.DB_DATABASE || 'nestle',
});

module.exports = pool;
