const { Pool } = require('pg');
const { PGlite } = require('@electric-sql/pglite');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let activeEngine = null; // 'pg' or 'pglite'
let pool = null;
let pgliteDb = null;

// Initialize connection
async function initDb() {
  if (activeEngine) return;

  const usePostgres = process.env.USE_POSTGRES_SERVER === 'true';

  if (usePostgres) {
    try {
      console.log('🔄 Attempting connection to PostgreSQL server...');
      pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'mobilya_db',
        connectionTimeoutMillis: 3000,
      });

      // Test connection
      await pool.query('SELECT 1');
      activeEngine = 'pg';
      console.log('✅ Connected to external PostgreSQL Server successfully!');
      return;
    } catch (err) {
      console.warn('⚠️ External PostgreSQL connection failed:', err.message);
      console.log('🔄 Switching to Embedded PostgreSQL (PGlite)...');
    }
  }

  // Use Embedded PostgreSQL (PGlite)
  try {
    const dataDir = path.join(__dirname, '../../database/pgdata');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    pgliteDb = new PGlite(dataDir);
    await pgliteDb.waitReady;
    activeEngine = 'pglite';
    console.log('✅ Embedded PostgreSQL (PGlite) engine is active & persistent at:', dataDir);

    // Auto-bootstrap tables if users table does not exist
    try {
      const checkTable = await pgliteDb.query(`
        SELECT 1 FROM information_schema.tables WHERE table_name = 'users'
      `);
      if (checkTable.rows.length === 0) {
        console.log('📦 Tables not found. Initializing PostgreSQL schema and seed data...');
        const schemaSql = fs.readFileSync(path.join(__dirname, '../../database/schema.sql'), 'utf-8');
        await pgliteDb.exec(schemaSql);
        console.log('✅ Schema tables created.');

        const seedSql = fs.readFileSync(path.join(__dirname, '../../database/seed.sql'), 'utf-8');
        await pgliteDb.exec(seedSql);
        console.log('✅ Seed data imported.');
      } else {
        console.log('ℹ️ Database tables and data already present.');
      }

      // Check if store_reviews table exists and bootstrap if missing
      const checkReviews = await pgliteDb.query(`
        SELECT 1 FROM information_schema.tables WHERE table_name = 'store_reviews'
      `);
      if (checkReviews.rows.length === 0) {
        console.log('📦 Creating store_reviews table and importing initial reviews...');
        await pgliteDb.exec(`
          CREATE TABLE IF NOT EXISTS store_reviews (
              id SERIAL PRIMARY KEY,
              store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
              user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
              customer_name VARCHAR(255) NOT NULL,
              rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
              comment TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
          CREATE INDEX IF NOT EXISTS idx_store_reviews_store ON store_reviews(store_id);
          CREATE INDEX IF NOT EXISTS idx_store_reviews_rating ON store_reviews(rating);

          INSERT INTO store_reviews (id, store_id, user_id, customer_name, rating, comment, created_at) VALUES
          (1, 1, 6, 'كرار الحيدري', 5, 'عاشت ايدكم على التعامل الراقي، اشتريت آيفون 16 برو ماكس أصلي ومضمون مع بكج حماية كامل.', CURRENT_TIMESTAMP - INTERVAL '2 days'),
          (2, 1, NULL, 'مصطفى كامل الجميلي', 5, 'أفضل محل بالشارع التجاري بأبو منيصير، أسعارهم مناسبة جداً وأجهزتهم كلها وكالة.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
          (3, 1, NULL, 'سرمد الكرخي', 5, 'خدمة ممتازة وضمان حقيقي، أنصح بالتعامل وياهم بأبو غريب.', CURRENT_TIMESTAMP - INTERVAL '6 days'),
          (4, 2, 6, 'أحمد العبيدي', 5, 'توفر جميع الإكسسوارات والشواحن الأصلية مع كفالة، كادر محترم ومتعاون جداً.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
          (5, 2, NULL, 'سيف علي', 4, 'محل مرتب وتعامل ممتاز، اشتريت جهاز من عدهم وتجربتي وياهم جانت ممتازة.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
          (6, 2, NULL, 'محمد جاسم', 5, 'أحسن محل في أبو منيصير لتجهيز الهواتف والاكسسوارات.', CURRENT_TIMESTAMP - INTERVAL '5 days'),
          (7, 3, 6, 'عمر الدليمي', 5, 'بدلت شاشة جهازي بوقت قياسي وشغل نظيف ومضبوط مع ضمان فحص.', CURRENT_TIMESTAMP - INTERVAL '1 day'),
          (8, 3, NULL, 'علي الجميلي', 5, 'أحسن فني صيانة بأبو غريب كلها، أمانة وسرعة بالعمل وقطع أصلية 100%.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
          (9, 3, NULL, 'حسام الزيدي', 5, 'سويت صيانة لآي سي الشحن وتم إصلاحه باحترافية عالية بنفس اليوم.', CURRENT_TIMESTAMP - INTERVAL '5 days');

          SELECT setval('store_reviews_id_seq', (SELECT MAX(id) FROM store_reviews));
        `);
        console.log('✅ store_reviews table created and seeded successfully.');
      }
    } catch (initErr) {
      console.error('Error during auto-initialization of schema:', initErr);
    }
  } catch (err) {
    console.error('❌ Failed to initialize PGlite engine:', err);
    throw err;
  }
}

async function query(text, params = []) {
  if (!activeEngine) {
    await initDb();
  }

  if (activeEngine === 'pg') {
    const res = await pool.query(text, params);
    return {
      rows: res.rows,
      rowCount: res.rowCount,
    };
  } else {
    // PGlite compatibility
    // Handle parameterized queries
    const res = await pgliteDb.query(text, params);
    return {
      rows: res.rows || [],
      rowCount: res.rows ? res.rows.length : (res.affectedRows || 0),
    };
  }
}

module.exports = {
  query,
  initDb,
  getEngine: () => activeEngine,
};
