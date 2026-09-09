const db = require('../config/db');

// GET /api/services - Browse services
exports.getServices = async (req, res) => {
  try {
    const { store_id, search } = req.query;

    let query = `
      SELECT srv.*, s.name as store_name, s.location as store_location, s.phone as store_phone, s.whatsapp as store_whatsapp
      FROM services srv
      JOIN stores s ON srv.store_id = s.id
      WHERE s.status = 'approved'
    `;
    const params = [];

    if (store_id) {
      params.push(store_id);
      query += ` AND srv.store_id = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (srv.name ILIKE $${params.length} OR srv.description ILIKE $${params.length})`;
    }

    query += ` ORDER BY srv.price ASC`;

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rowCount, services: result.rows });
  } catch (err) {
    console.error('Error in getServices:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب الخدمات.' });
  }
};

// POST /api/services - Add service (Protected)
exports.createService = async (req, res) => {
  try {
    const { store_id, name, description, price, availability } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم الخدمة والسعر.' });
    }

    let targetStoreId = store_id;
    if (req.user.role === 'store_owner') {
      const storeRes = await db.query('SELECT id FROM stores WHERE owner_id = $1 LIMIT 1', [req.user.id]);
      if (storeRes.rowCount === 0) {
        return res.status(400).json({ success: false, message: 'ليس لديك متجر بعد.' });
      }
      targetStoreId = storeRes.rows[0].id;
    }

    const insertRes = await db.query(
      `INSERT INTO services (store_id, name, description, price, availability)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [targetStoreId, name.trim(), description || '', price, availability || 'available']
    );

    res.status(201).json({
      success: true,
      message: 'تمت إضافة الخدمة بنجاح.',
      service: insertRes.rows[0],
    });
  } catch (err) {
    console.error('Error in createService:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء إضافة الخدمة.' });
  }
};

// PUT /api/services/:id
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, availability } = req.body;

    const srvRes = await db.query(
      `SELECT srv.*, s.owner_id FROM services srv JOIN stores s ON srv.store_id = s.id WHERE srv.id = $1`,
      [id]
    );
    if (srvRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'الخدمة غير موجودة.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== srvRes.rows[0].owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بتعديل هذه الخدمة.' });
    }

    const updateRes = await db.query(
      `UPDATE services
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           availability = COALESCE($4, availability)
       WHERE id = $5
       RETURNING *`,
      [name, description, price, availability, id]
    );

    res.json({ success: true, message: 'تم تحديث الخدمة بنجاح.', service: updateRes.rows[0] });
  } catch (err) {
    console.error('Error in updateService:', err);
    res.status(500).json({ success: false, message: 'خطأ في تعديل الخدمة.' });
  }
};

// DELETE /api/services/:id
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const srvRes = await db.query(
      `SELECT srv.*, s.owner_id FROM services srv JOIN stores s ON srv.store_id = s.id WHERE srv.id = $1`,
      [id]
    );
    if (srvRes.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'الخدمة غير موجودة.' });
    }

    if (req.user.role !== 'admin' && req.user.id !== srvRes.rows[0].owner_id) {
      return res.status(403).json({ success: false, message: 'غير مصرح بحذف هذه الخدمة.' });
    }

    await db.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ success: true, message: 'تم حذف الخدمة بنجاح.' });
  } catch (err) {
    console.error('Error in deleteService:', err);
    res.status(500).json({ success: false, message: 'خطأ في حذف الخدمة.' });
  }
};
