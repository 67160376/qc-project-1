const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Create alert (useful for testing)
router.post('/', auth, async (req, res) => {
  const { message, level, related_product_id, related_inspection_id } = req.body;
  if (!message) return res.status(400).json({ error: 'message required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO alerts (message, level, related_product_id, related_inspection_id) VALUES ($1,$2,$3,$4) RETURNING *',
      [message, level || 'info', related_product_id || null, related_inspection_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// GET alerts
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM alerts ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list alerts' });
  }
});

// acknowledge alert
router.put('/:id/acknowledge', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('UPDATE alerts SET acknowledged = TRUE, acknowledged_at = NOW() WHERE id = $1 RETURNING *', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Alert not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to acknowledge alert' });
  }
});

// delete alert
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM alerts WHERE id = $1', [req.params.id]);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
