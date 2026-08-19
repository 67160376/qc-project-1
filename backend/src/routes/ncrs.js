const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// create ncr
router.post('/', auth, async (req, res) => {
  const { title, description, status, related_inspection_id } = req.body;
  const allowed = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'];
  const st = (status || 'OPEN').toUpperCase();
  if (!allowed.includes(st)) return res.status(400).json({ error: 'Invalid status' });
  try {
    const { rows } = await pool.query('INSERT INTO ncrs (title, description, status, related_inspection_id) VALUES ($1,$2,$3,$4) RETURNING *', [title || null, description || null, st, related_inspection_id || null]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create ncr' });
  }
});

// list ncrs
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ncrs ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list ncrs' });
  }
});

// get ncr
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM ncrs WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'NCR not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get ncr' });
  }
});

// update ncr
router.put('/:id', auth, async (req, res) => {
  const { title, description, status } = req.body;
  const allowed = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED'];
  if (status && !allowed.includes(status.toUpperCase())) return res.status(400).json({ error: 'Invalid status' });
  try {
    const { rows } = await pool.query('UPDATE ncrs SET title = COALESCE($1,title), description = COALESCE($2,description), status = COALESCE($3,status), updated_at = NOW() WHERE id = $4 RETURNING *', [title || null, description || null, status ? status.toUpperCase() : null, req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'NCR not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update ncr' });
  }
});

// delete ncr
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM ncrs WHERE id = $1', [req.params.id]);
    res.json({ message: 'NCR deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ncr' });
  }
});

module.exports = router;
