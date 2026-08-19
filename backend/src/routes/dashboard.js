const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/summary', auth, async (req, res) => {
  try {
    const totalProductsRes = await pool.query('SELECT COUNT(*) FROM products');
    const totalInspectionsRes = await pool.query('SELECT COUNT(*) FROM inspections');
    const passedInspectionsRes = await pool.query("SELECT COUNT(*) FROM inspections WHERE passed_quantity >= 1");
    const failedInspectionsRes = await pool.query("SELECT COUNT(*) FROM inspections WHERE failed_quantity >= 1");
    const openNcrsRes = await pool.query("SELECT COUNT(*) FROM ncrs WHERE status = 'OPEN'");
    const activeAlertsRes = await pool.query('SELECT COUNT(*) FROM alerts WHERE acknowledged = FALSE');

    const summary = {
      total_products: parseInt(totalProductsRes.rows[0].count, 10),
      total_inspections: parseInt(totalInspectionsRes.rows[0].count, 10),
      passed_inspections: parseInt(passedInspectionsRes.rows[0].count, 10),
      failed_inspections: parseInt(failedInspectionsRes.rows[0].count, 10),
      open_ncrs: parseInt(openNcrsRes.rows[0].count, 10),
      active_alerts: parseInt(activeAlertsRes.rows[0].count, 10),
    };

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
});

module.exports = router;
