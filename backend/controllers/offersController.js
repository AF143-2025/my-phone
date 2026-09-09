const db = require('../config/db');

// GET /api/offers - Active flash deals and discounts
exports.getOffers = async (req, res) => {
  try {
    const query = `
      SELECT 
        o.*,
        p.name as product_name,
        p.description as product_description,
        (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) as image_url,
        s.name as store_name,
        s.location as store_location,
        s.whatsapp as store_whatsapp
      FROM offers o
      JOIN stores s ON o.store_id = s.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.active = true AND s.status = 'approved'
      ORDER BY o.discount_percentage DESC, o.id DESC
    `;

    const result = await db.query(query);
    res.json({ success: true, count: result.rowCount, offers: result.rows });
  } catch (err) {
    console.error('Error in getOffers:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب العروض.' });
  }
};

// POST /api/offers - Create flash deal (Protected)
exports.createOffer = async (req, res) => {
  try {
    const { store_id, product_id, old_price, new_price, discount_percentage, end_date } = req.body;

    if (!product_id || !new_price) {
      return res.status(400).json({ success: false, message: 'يرجى تحديد المنتج وسعر العرض الجديد.' });
    }

    let targetStoreId = store_id;
    if (req.user.role === 'store_owner') {
      const storeRes = await db.query('SELECT id FROM stores WHERE owner_id = $1 LIMIT 1', [req.user.id]);
      if (storeRes.rowCount === 0) {
        return res.status(400).json({ success: false, message: 'ليس لديك متجر بعد.' });
      }
      targetStoreId = storeRes.rows[0].id;
    }

    // Auto-calculate discount percentage if not provided
    let discount = discount_percentage;
    if (!discount && old_price && old_price > new_price) {
      discount = Math.round(((old_price - new_price) / old_price) * 100);
    }

    const insertRes = await db.query(
      `INSERT INTO offers (store_id, product_id, old_price, new_price, discount_percentage, end_date, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [targetStoreId, product_id, old_price || null, new_price, discount || null, end_date || null]
    );

    res.status(201).json({
      success: true,
      message: 'تم نشر العرض بنجاح على المنصة!',
      offer: insertRes.rows[0],
    });
  } catch (err) {
    console.error('Error in createOffer:', err);
    res.status(500).json({ success: false, message: 'خطأ في إنشاء العرض.' });
  }
};
