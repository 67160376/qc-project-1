const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/v1/products
router.post('/', auth, async (req, res) => {
  const { product_code, product_name, category, description } = req.body;
  if (!product_code || !product_name) return res.status(400).json({ error: 'product_code and product_name required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO products (product_code, product_name, category, description) VALUES ($1,$2,$3,$4) RETURNING *',
      [product_code, product_name, category || null, description || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    // handle unique constraint on product_code
    if (err && err.code === '23505') {
      return res.status(409).json({ error: 'Product code already exists' });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// GET /api/v1/products
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list products' });
  }
});

// GET /api/v1/products/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get product' });
  }
});

// PUT /api/v1/products/:id
router.put('/:id', auth, async (req, res) => {
  const { product_code, product_name, category, description } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE products SET product_code = COALESCE($1, product_code), product_name = COALESCE($2, product_name), category = COALESCE($3, category), description = COALESCE($4, description), updated_at = NOW() WHERE id = $5 RETURNING *',
      [product_code || null, product_name || null, category || null, description || null, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/v1/products/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
