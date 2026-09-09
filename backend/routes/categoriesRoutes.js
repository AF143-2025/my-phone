const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) as products_count
      FROM categories c
      ORDER BY c.id ASC
    `);
    res.json({ success: true, categories: result.rows });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الأقسام.' });
  }
});

module.exports = router;
