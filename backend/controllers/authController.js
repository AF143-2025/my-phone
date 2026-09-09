const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mobilya_abu_ghraib_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء ملء كافة الحقول الأساسية (الاسم، البريد الإلكتروني، كلمة المرور).',
      });
    }

    // Protect Admin registration: NEVER allow registration as admin
    let userRole = role || 'customer';
    if (userRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح: لا يمكن إنشاء حساب مدير جديد عبر استمارة التسجيل العامة.',
      });
    }

    if (!['customer', 'store_owner'].includes(userRole)) {
      userRole = 'customer';
    }

    // Check if email already exists
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (existing.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const insertResult = await db.query(
      `INSERT INTO users (name, email, phone, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, phone, role, created_at`,
      [name.trim(), email.toLowerCase().trim(), phone || null, password_hash, userRole]
    );

    const newUser = insertResult.rows[0];

    // Create JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح! مرحباً بك في Mobilya.',
      token,
      user: newUser,
    });
  } catch (err) {
    console.error('Error in register:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء إنشاء الحساب.',
      error: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.',
      });
    }

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.',
      });
    }

    const user = result.rows[0];

    // Verify password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.',
      });
    }

    // Check if user has an associated store
    let userStore = null;
    if (user.role === 'store_owner') {
      const storeRes = await db.query('SELECT id, name, status, verified FROM stores WHERE owner_id = $1 LIMIT 1', [user.id]);
      if (storeRes.rowCount > 0) {
        userStore = storeRes.rows[0];
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: `مرحباً بك مجدداً يا ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        store: userStore,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء تسجيل الدخول.',
      error: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح.',
  });
};

exports.getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود.' });
    }

    const user = result.rows[0];

    // Attach store if owner
    let store = null;
    if (user.role === 'store_owner') {
      const storeRes = await db.query('SELECT * FROM stores WHERE owner_id = $1 LIMIT 1', [user.id]);
      if (storeRes.rowCount > 0) {
        store = storeRes.rows[0];
      }
    }

    res.json({
      success: true,
      user: {
        ...user,
        store,
      },
    });
  } catch (err) {
    console.error('Error in getMe:', err);
    res.status(500).json({ success: false, message: 'خطأ في جلب بيانات الحساب.' });
  }
};
