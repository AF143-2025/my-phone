const db = require('../config/db');

// GET /api/products - Search, Filter and Browse
exports.getProducts = async (req, res) => {
  try {
    const { search, category_id, store_id, availability, min_price, max_price, sort } = req.query;

    let query = `
      SELECT 
        p.*,
        s.name as store_name,
        s.location as store_location,
        s.phone as store_phone,
        s.whatsapp as store_whatsapp,
        s.verified as store_verified,
        c.name as category_name,
        c.icon as category_icon,
        (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id LIMIT 1) as image_url,
        (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) as images
      FROM products p
      JOIN stores s ON p.store_id = s.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE s.status = 'approved'
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length} OR s.name ILIKE $${params.length})`;
    }

    if (category_id) {
      params.push(category_id);
      query += ` AND p.category_id = $${params.length}`;
    }

    if (store_id) {
      params.push(store_id);
      query += ` AND p.store_id = $${params.length}`;
    }

    if (availability) {
      params.push(availability);
      query += ` AND p.availability = $${params.length}`;
    }

    if (min_price) {
      params.push(min_price);
      query += ` AND p.price >= $${params.length}`;
    }

    if (max_price) {
      params.push(max_price);
      query += ` AND p.price <= $${params.length}`;
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ` ORDER BY p.price ASC`;
    } else if (sort === 'price_desc') {
      query += ` ORDER BY p.price DESC`;
    } else {
      query += ` ORDER BY p.id DESC`;
    }

    const result = await db.query(query, params);

    res.json({
      success: true,
      count: result.rowCount,
      products: result.rows,
    });
  } catch (err) {
    console.error('Error in getProducts:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب المنتجات.', error: err.message });
  }
};

// GET /api/products/:id - Single product with details
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT 
        p.*,
        s.name as store_name,
        s.location as store_location,
        s.address as store_address,
        s.phone as store_phone,
        s.whatsapp as store_whatsapp,
        s.verified as store_verified,
        c.name as category_name,
        c.icon as category_icon,
        (SELECT json_agg(image_url) FROM product_images pi WHERE pi.product_id = p.id) as images
       FROM products p
       JOIN stores s ON p.store_id = s.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المنتج غير موجود.' });
    }

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (err) {
    console.error('Error in getProductById:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في جلب بيانات المنتج.' });
  }
};

// POST /api/products - Create product (Protected: Store Owner / Admin)
exports.createProduct = async (req, res) => {
  try {
    const { store_id, category_id, name, description, price, availability, image_url, images } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'يرجى تحديد اسم المنتج والسعر.' });
    }

    // Determine target store
    let targetStoreId = store_id;
    if (req.user.role === 'store_owner') {
      const storeRes = await db.query('SELECT id, status FROM stores WHERE owner_id = $1 LIMIT 1', [req.user.id]);
      if (storeRes.rowCount === 0) {
        return res.status(400).json({ success: false, message: 'ليس لديك متجر مسجل بعد. يرجى إنشاء متجرك أولاً.' });
      }
      targetStoreId = storeRes.rows[0].id;
    } else if (!targetStoreId) {
      return res.status(400).json({ success: false, message: 'يرجى تحديد المتجر الذي ينتمي له المنتج.' });
    }

    // Verify ownership if not admin
    if (req.user.role !== 'admin') {
      const ownerCheck = await db.query('SELECT owner_id FROM stores WHERE id = $1', [targetStoreId]);
      if (ownerCheck.rowCount === 0 || ownerCheck.rows[0].owner_id !== req.user.id) {
        return res.status(403).json({ success: false, message: 'غير مصرح: لا يمكنك إضافة منتجات لمتجر لا تملكه.' });
      }
    }

    const insertRes = await db.query(
      `INSERT INTO products (store_id, category_id, name, description, price, availability)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        targetStoreId,
        category_id || 1,
        name.trim(),
        description || '',
        price,
        availability || 'available',
      ]
    );

    const newProduct = insertRes.rows[0];

    // Insert images
    const allImages = [];
    if (image_url) allImages.push(image_url);
    if (Array.isArray(images)) allImages.push(...images);

    for (const url of allImages) {
      if (url && typeof url === 'string') {
        await db.query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [newProduct.id, url.trim()]);
      }
    }

    res.status(201).json({
      success: true,
      message: 'تمت إضافة المنتج بنجاح إلى متجرك.',
      product: newProduct,
    });
  } catch (err) {
    console.error('Error in createProduct:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة المنتج.', error: err.message });
  }
};

// PUT /api/products/:id - Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, name, description, price, availability, image_url } = req.body;

    // Check product and store ownership
    const prodRes = await db.query(
      `SELECT p.*, s.owner_id FROM products p JOIN stores s ON p.store_id = s.id WHERE p.id = $1`,
      [id]
    );

    if (prodRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المنتج غير موجود.' });
    }

    const prod = prodRes.rows[0];
    if (req.user.role !== 'admin' && req.user.id !== prod.owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بتعديل هذا المنتج.' });
    }

    const updateRes = await db.query(
      `UPDATE products
       SET category_id = COALESCE($1, category_id),
           name = COALESCE($2, name),
           description = COALESCE($3, description),
           price = COALESCE($4, price),
           availability = COALESCE($5, availability),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [category_id, name, description, price, availability, id]
    );

    if (image_url) {
      await db.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)', [id, image_url]);
    }

    res.json({
      success: true,
      message: 'تم تحديث بيانات المنتج بنجاح.',
      product: updateRes.rows[0],
    });
  } catch (err) {
    console.error('Error in updateProduct:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تعديل المنتج.' });
  }
};

// DELETE /api/products/:id - Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const prodRes = await db.query(
      `SELECT p.*, s.owner_id FROM products p JOIN stores s ON p.store_id = s.id WHERE p.id = $1`,
      [id]
    );

    if (prodRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المنتج غير موجود.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== prodRes.rows[0].owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح لك بحذف هذا المنتج.' });
    }

    await db.query('DELETE FROM products WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'تم حذف المنتج بنجاح.',
    });
  } catch (err) {
    console.error('Error in deleteProduct:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف المنتج.' });
  }
};
