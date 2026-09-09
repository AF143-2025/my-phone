const db = require('../config/db');

// GET /api/admin/dashboard - System Stats & KPI Overviews
exports.getDashboardStats = async (req, res) => {
  try {
    const [usersCount, storesCount, pendingStoresCount, productsCount, servicesCount] = await Promise.all([
      db.query('SELECT COUNT(*) FROM users'),
      db.query("SELECT COUNT(*) FROM stores WHERE status = 'approved'"),
      db.query("SELECT COUNT(*) FROM stores WHERE status = 'pending'"),
      db.query('SELECT COUNT(*) FROM products'),
      db.query('SELECT COUNT(*) FROM services'),
    ]);

    const recentStores = await db.query(`
      SELECT s.*, u.name as owner_name, u.email as owner_email
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      ORDER BY s.id DESC
      LIMIT 10
    `);

    const recentUsers = await db.query(`
      SELECT id, name, email, phone, role, created_at
      FROM users
      ORDER BY id DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      stats: {
        totalUsers: parseInt(usersCount.rows[0].count, 10),
        totalApprovedStores: parseInt(storesCount.rows[0].count, 10),
        totalPendingStores: parseInt(pendingStoresCount.rows[0].count, 10),
        totalProducts: parseInt(productsCount.rows[0].count, 10),
        totalServices: parseInt(servicesCount.rows[0].count, 10),
      },
      recentStores: recentStores.rows,
      recentUsers: recentUsers.rows,
    });
  } catch (err) {
    console.error('Error in getDashboardStats:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في جلب إحصائيات الإدارة.' });
  }
};

// GET /api/admin/stores/pending - Pending store requests
exports.getPendingStores = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT s.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone
      FROM stores s
      JOIN users u ON s.owner_id = u.id
      WHERE s.status = 'pending'
      ORDER BY s.id ASC
    `);

    res.json({
      success: true,
      count: result.rowCount,
      stores: result.rows,
    });
  } catch (err) {
    console.error('Error in getPendingStores:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب المحلات المعلقة.' });
  }
};

// PUT /api/admin/stores/:id/approve - Approve store
exports.approveStore = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `UPDATE stores SET status = 'approved' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    const store = result.rows[0];

    // Send notification to store owner
    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, '🎉 تمت الموافقة على متجرك!', $2, 'store')`,
      [store.owner_id, `تهانينا! تمت مراجعة متجر "${store.name}" والموافقة عليه وهو الآن يظهر لجميع زبائن أبو غريب.`]
    );

    res.json({
      success: true,
      message: `تم اعتماد وتفعيل متجر "${store.name}" بنجاح وهو متاح للعامة الآن!`,
      store,
    });
  } catch (err) {
    console.error('Error in approveStore:', err);
    res.status(500).json({ success: false, message: 'خطأ أثناء اعتماد المتجر.' });
  }
};

// PUT /api/admin/stores/:id/reject - Reject store
exports.rejectStore = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await db.query(
      `UPDATE stores SET status = 'rejected' WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    const store = result.rows[0];

    await db.query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, 'ملاحظة حول تسجيل المتجر ℹ️', $2, 'store')`,
      [store.owner_id, `تم رفض طلب متجرك "${store.name}". السبب: ${reason || 'عدم استيفاء الشروط أو نقص بالمعلومات'}.`]
    );

    res.json({
      success: true,
      message: `تم رفض المتجر بنجاح.`,
      store,
    });
  } catch (err) {
    console.error('Error in rejectStore:', err);
    res.status(500).json({ success: false, message: 'خطأ أثناء رفض المتجر.' });
  }
};

// PUT /api/admin/stores/:id/verify - Toggle verified badge
exports.verifyStore = async (req, res) => {
  try {
    const { id } = req.params;

    const current = await db.query('SELECT verified, owner_id, name FROM stores WHERE id = $1', [id]);
    if (current.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    const newStatus = !current.rows[0].verified;
    const updateRes = await db.query(
      'UPDATE stores SET verified = $1 WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    if (newStatus) {
      await db.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, '🛡️ مبروك! متجرك موثق رسمياً', $2, 'store')`,
        [current.rows[0].owner_id, `تم منح متجر "${current.rows[0].name}" شارة التوثيق والضمان المعتمدة في أبو غريب.`]
      );
    }

    res.json({
      success: true,
      message: newStatus ? 'تم توثيق المحل بشارة الوكالة والمصداقية!' : 'تمت إزالة شارة التوثيق.',
      store: updateRes.rows[0],
    });
  } catch (err) {
    console.error('Error in verifyStore:', err);
    res.status(500).json({ success: false, message: 'خطأ أثناء تحديث حالة التوثيق.' });
  }
};

// PUT /api/admin/users/:id/ban - Ban user
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent banning the primary admin
    if (parseInt(id, 10) === 1) {
      return res.status(400).json({ success: false, message: 'لا يمكن حظر المدير الرئيسي للنظام.' });
    }

    // Suspend associated stores if any
    await db.query("UPDATE stores SET status = 'suspended' WHERE owner_id = $1", [id]);

    // Delete or deactivate
    await db.query('DELETE FROM users WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'تم حظر الحساب وتعليق المتاجر المرتبطة به بنجاح.',
    });
  } catch (err) {
    console.error('Error in banUser:', err);
    res.status(500).json({ success: false, message: 'خطأ أثناء حظر المستخدم.' });
  }
};
