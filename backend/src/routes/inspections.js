const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// create inspection
router.post('/', auth, async (req, res) => {
  const { product_id, inspection_type, lot_number, quantity, passed_quantity, failed_quantity, status, inspector_id } = req.body;
  if (!product_id || !inspection_type) return res.status(400).json({ error: 'product_id and inspection_type required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO inspections (product_id, inspection_type, lot_number, quantity, passed_quantity, failed_quantity, status, inspector_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [product_id, inspection_type, lot_number || null, quantity || 0, passed_quantity || 0, failed_quantity || 0, status || 'PENDING', inspector_id || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create inspection' });
  }
});

// list inspections
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inspections ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list inspections' });
  }
});

// get inspection
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inspections WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Inspection not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get inspection' });
  }
});

// update inspection
router.put('/:id', auth, async (req, res) => {
  const { inspection_type, lot_number, quantity, passed_quantity, failed_quantity, status, inspector_id } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE inspections SET inspection_type = COALESCE($1, inspection_type), lot_number = COALESCE($2, lot_number), quantity = COALESCE($3, quantity), passed_quantity = COALESCE($4, passed_quantity), failed_quantity = COALESCE($5, failed_quantity), status = COALESCE($6, status), inspector_id = COALESCE($7, inspector_id), updated_at = NOW() WHERE id = $8 RETURNING *',
      [inspection_type || null, lot_number || null, quantity || null, passed_quantity || null, failed_quantity || null, status || null, inspector_id || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Inspection not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update inspection' });
  }
});

// delete inspection
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM inspections WHERE id = $1', [req.params.id]);
    res.json({ message: 'Inspection deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete inspection' });
  }
});

module.exports = router;
