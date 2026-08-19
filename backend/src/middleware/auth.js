const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'change_me';

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    // attach user info (id) to request
    const { rows } = await pool.query('SELECT id, username, name, role FROM users WHERE id = $1', [payload.id]);
    if (rows.length === 0) return res.status(401).json({ error: 'User not found' });
    req.user = rows[0];
    next();
  } catch (err) {
    console.error('auth error', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
