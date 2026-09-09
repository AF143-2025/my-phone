const db = require('../config/db');

// GET /api/favorites - Customer's saved wishlist
exports.getFavorites = async (req, res) => {
  try {
    const query = `
      SELECT 
        f.id as favorite_id,
        f.created_at as saved_at,
        p.*,
        s.name as store_name,
        s.location as store_location,
        s.whatsapp as store_whatsapp,
        (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) as image_url
      FROM favorites f
      JOIN products p ON f.product_id = p.id
      JOIN stores s ON p.store_id = s.id
      WHERE f.user_id = $1
      ORDER BY f.id DESC
    `;

    const result = await db.query(query, [req.user.id]);
    res.json({ success: true, count: result.rowCount, favorites: result.rows });
  } catch (err) {
    console.error('Error in getFavorites:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب قائمة المفضلة.' });
  }
};

// POST /api/favorites - Add product to favorites
exports.addFavorite = async (req, res) => {
  try {
    const { product_id } = req.body;
    if (!product_id) {
      return res.status(400).json({ success: false, message: 'يرجى تحديد رقم المنتج.' });
    }

    // Check if already in favorites
    const existing = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
      [req.user.id, product_id]
    );

    if (existing.rowCount > 0) {
      return res.status(409).json({ success: false, message: 'المنتج موجود بالفعل في المفضلة.' });
    }

    const insertRes = await db.query(
      'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, product_id]
    );

    res.status(201).json({
      success: true,
      message: 'تمت إضافة المنتج إلى المفضلة ❤️',
      favorite: insertRes.rows[0],
    });
  } catch (err) {
    console.error('Error in addFavorite:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء الإضافة للمفضلة.' });
  }
};

// DELETE /api/favorites/:id (or by product_id)
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    // Can delete either by favorite id or by product_id
    const deleteRes = await db.query(
      'DELETE FROM favorites WHERE user_id = $1 AND (id = $2 OR product_id = $2) RETURNING *',
      [req.user.id, id]
    );

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود في المفضلة.' });
    }

    res.json({ success: true, message: 'تمت إزالة المنتج من المفضلة.' });
  } catch (err) {
    console.error('Error in removeFavorite:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء الإزالة من المفضلة.' });
  }
};
