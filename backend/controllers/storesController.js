const db = require('../config/db');

// GET /api/stores - Public list of approved stores
exports.getStores = async (req, res) => {
  try {
    const { search, location, verified } = req.query;

    let query = `
      SELECT 
        s.*,
        u.name as owner_name,
        u.email as owner_email,
        (SELECT COUNT(*) FROM products p WHERE p.store_id = s.id) as products_count,
        (SELECT COUNT(*) FROM services srv WHERE srv.store_id = s.id) as services_count,
        COALESCE(ROUND((SELECT AVG(sr.rating) FROM store_reviews sr WHERE sr.store_id = s.id)::numeric, 1), 5.0) as avg_rating,
        (SELECT COUNT(*) FROM store_reviews sr WHERE sr.store_id = s.id) as reviews_count
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      WHERE s.status = 'approved'
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (s.name ILIKE $${params.length} OR s.description ILIKE $${params.length} OR s.address ILIKE $${params.length})`;
    }

    if (location && location !== 'الكل') {
      params.push(`%${location}%`);
      query += ` AND s.location ILIKE $${params.length}`;
    }

    if (verified === 'true') {
      query += ` AND s.verified = true`;
    }

    query += ` ORDER BY s.verified DESC, s.id ASC`;

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rowCount,
      stores: result.rows,
    });
  } catch (err) {
    console.error('Error in getStores:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب قائمة المحلات.', error: err.message });
  }
};

// GET /api/stores/:id - Store profile with its products, services, offers, and reviews
exports.getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    const storeRes = await db.query(
      `SELECT s.*, u.name as owner_name, u.email as owner_email 
       FROM stores s 
       JOIN users u ON s.owner_id = u.id 
       WHERE s.id = $1`,
      [id]
    );

    if (storeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل المطلوب غير موجود.' });
    }

    const store = storeRes.rows[0];

    // If store is not approved, only owner or admin can view
    if (store.status !== 'approved') {
      const isOwner = req.user && req.user.id === store.owner_id;
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'هذا المتجر قيد المراجعة ولم يعتمد بعد.' });
      }
    }

    // Fetch products
    const productsRes = await db.query(
      `SELECT p.*, c.name as category_name, c.icon as category_icon,
              (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) as image_url
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.store_id = $1
       ORDER BY p.id DESC`,
      [id]
    );

    // Fetch services
    const servicesRes = await db.query(
      `SELECT * FROM services WHERE store_id = $1 ORDER BY id ASC`,
      [id]
    );

    // Fetch active offers
    const offersRes = await db.query(
      `SELECT o.*, p.name as product_name 
       FROM offers o 
       LEFT JOIN products p ON o.product_id = p.id 
       WHERE o.store_id = $1 AND o.active = true`,
      [id]
    );

    // Fetch reviews
    const reviewsRes = await db.query(
      `SELECT sr.*, u.role as user_role 
       FROM store_reviews sr 
       LEFT JOIN users u ON sr.user_id = u.id 
       WHERE sr.store_id = $1 
       ORDER BY sr.created_at DESC`,
      [id]
    );

    const reviews = reviewsRes.rows;
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0 
      ? Number((reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviewsCount).toFixed(1))
      : 5.0;

    res.json({
      success: true,
      store: {
        ...store,
        avg_rating: avgRating,
        reviews_count: reviewsCount,
        reviews: reviews,
        products: productsRes.rows,
        services: servicesRes.rows,
        offers: offersRes.rows,
      },
    });
  } catch (err) {
    console.error('Error in getStoreById:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب تفاصيل المتجر.' });
  }
};

// POST /api/stores - Register new store (Protected)
exports.createStore = async (req, res) => {
  try {
    const { name, description, logo, cover_image, location, address, phone, whatsapp, opening_hours } = req.body;

    if (!name || !location || !phone) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المحل والمنطقة ورقم الهاتف.',
      });
    }

    // Check if store owner already has a store
    if (req.user.role === 'store_owner') {
      const existing = await db.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
      if (existing.rowCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'لديك محل مسجل بالفعل. يمكنك تعديل بياناته من لوحة التحكم.',
        });
      }
    }

    const insertRes = await db.query(
      `INSERT INTO stores (owner_id, name, description, logo, cover_image, location, address, phone, whatsapp, opening_hours, status, verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', false)
       RETURNING *`,
      [
        req.user.id,
        name.trim(),
        description || '',
        logo || '',
        cover_image || '',
        location.trim(),
        address || '',
        phone.trim(),
        whatsapp || phone.trim(),
        opening_hours || '9:00 ص - 10:00 م',
      ]
    );

    const newStore = insertRes.rows[0];

    // Create an admin notification
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       SELECT id, 'طلب تسجيل محل جديد 🏪', $1, 'admin'
       FROM users WHERE role = 'admin'`,
      [`قام المحل "${newStore.name}" في (${newStore.location}) بتقديم طلب تسجيل وينتظر اعتمادك.`]
    );

    res.status(201).json({
      success: true,
      message: 'تم إرسال طلب تسجيل المحل بنجاح! سيتم مراجعته وتفعيله من قبل الإدارة.',
      store: newStore,
    });
  } catch (err) {
    console.error('Error in createStore:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء تسجيل المحل.', error: err.message });
  }
};

// PUT /api/stores/:id - Update store details (Protected)
exports.updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo, cover_image, location, address, phone, whatsapp, opening_hours } = req.body;

    const storeRes = await db.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (storeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    const store = storeRes.rows[0];

    // Check authorization: Owner or Admin
    if (req.user.role !== 'admin' && req.user.id !== store.owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل بيانات هذا المتجر.' });
    }

    const updateRes = await db.query(
      `UPDATE stores
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           logo = COALESCE($3, logo),
           cover_image = COALESCE($4, cover_image),
           location = COALESCE($5, location),
           address = COALESCE($6, address),
           phone = COALESCE($7, phone),
           whatsapp = COALESCE($8, whatsapp),
           opening_hours = COALESCE($9, opening_hours)
       WHERE id = $10
       RETURNING *`,
      [name, description, logo, cover_image, location, address, phone, whatsapp, opening_hours, id]
    );

    res.json({
      success: true,
      message: 'تم تحديث بيانات المحل بنجاح.',
      store: updateRes.rows[0],
    });
  } catch (err) {
    console.error('Error in updateStore:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تعديل المحل.' });
  }
};

// DELETE /api/stores/:id - Delete store (Protected)
exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const storeRes = await db.query('SELECT * FROM stores WHERE id = $1', [id]);
    if (storeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== storeRes.rows[0].owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذا المتجر.' });
    }

    await db.query('DELETE FROM stores WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'تم حذف المحل وكافة منتجاته وخدماته بنجاح.',
    });
  } catch (err) {
    console.error('Error in deleteStore:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المتجر.' });
  }
};

// GET /api/stores/:id/reviews - Get reviews and ratings for a store
exports.getStoreReviews = async (req, res) => {
  try {
    const { id } = req.params;

    const reviewsRes = await db.query(
      `SELECT sr.*, u.role as user_role 
       FROM store_reviews sr 
       LEFT JOIN users u ON sr.user_id = u.id 
       WHERE sr.store_id = $1 
       ORDER BY sr.created_at DESC`,
      [id]
    );

    const reviews = reviewsRes.rows;
    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0 
      ? Number((reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviewsCount).toFixed(1))
      : 5.0;

    // Star breakdown (5, 4, 3, 2, 1)
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = parseInt(r.rating, 10);
      if (breakdown[star] !== undefined) {
        breakdown[star]++;
      }
    });

    res.json({
      success: true,
      store_id: Number(id),
      avg_rating: avgRating,
      reviews_count: reviewsCount,
      breakdown,
      reviews,
    });
  } catch (err) {
    console.error('Error in getStoreReviews:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب مراجعات المتجر.' });
  }
};

// POST /api/stores/:id/reviews - Submit customer review for a store
exports.addStoreReview = async (req, res) => {
  try {
    const { id } = req.params;
    let { rating, comment, customer_name } = req.body;

    // Validate rating
    rating = parseInt(rating, 10);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تحديد التقييم من 1 إلى 5 نجوم.',
      });
    }

    // Determine user ID & customer name
    let userId = null;
    if (req.user) {
      userId = req.user.id;
      if (!customer_name || !customer_name.trim()) {
        customer_name = req.user.name;
      }
    }

    if (!customer_name || !customer_name.trim()) {
      customer_name = 'زبون من أبو غريب';
    }

    // Verify store exists
    const storeRes = await db.query('SELECT id, name FROM stores WHERE id = $1', [id]);
    if (storeRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المتجر غير موجود.' });
    }

    // Insert review
    const insertRes = await db.query(
      `INSERT INTO store_reviews (store_id, user_id, customer_name, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, userId, customer_name.trim(), rating, comment ? comment.trim() : null]
    );

    const newReview = insertRes.rows[0];

    // Compute updated aggregates
    const statsRes = await db.query(
      `SELECT COUNT(*) as count, ROUND(AVG(rating)::numeric, 1) as avg FROM store_reviews WHERE store_id = $1`,
      [id]
    );

    res.status(201).json({
      success: true,
      message: 'شكراً لك! تم إضافة تقييمك بنجاح.',
      review: newReview,
      avg_rating: Number(statsRes.rows[0].avg || rating),
      reviews_count: parseInt(statsRes.rows[0].count || 1, 10),
    });
  } catch (err) {
    console.error('Error in addStoreReview:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حفظ التقييم.', error: err.message });
  }
};

