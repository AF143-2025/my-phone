const db = require('../config/db');

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'عذراً، ليس لديك الصلاحية الكافية للقيام بهذا الإجراء.',
      });
    }
    next();
  };
}

// Ensure store owner only touches their own store
async function checkStoreOwnership(req, res, next) {
  try {
    const storeId = req.params.storeId || req.params.id;
    if (!storeId) return next();

    // Admins have override access
    if (req.user.role === 'admin') return next();

    const result = await db.query('SELECT owner_id FROM stores WHERE id = $1', [storeId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المحل غير موجود.' });
    }

    if (result.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح: لا يمكنك إدارة متجر يتبع لصاحب حساب آخر.',
      });
    }

    next();
  } catch (err) {
    console.error('Error in checkStoreOwnership:', err);
    res.status(500).json({ success: false, message: 'حدث خطأ في الخادم أثناء التحقق من الملكية.' });
  }
}

module.exports = {
  authorizeRoles,
  checkStoreOwnership,
};
