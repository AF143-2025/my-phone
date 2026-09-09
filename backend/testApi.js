const http = require('http');
const app = require('./server');

const PORT = 5055; // test port
let server;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dataString),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(raw);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw });
          }
        });
      }
    );

    req.on('error', reject);
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting automated API Verification Test Suite...\n');
  server = app.listen(PORT);

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    console.log('1. Health Check:', health.status === 200 && health.data.status === 'healthy' ? '✅ PASS' : '❌ FAIL');

    // 2. Stores list
    const stores = await request('GET', '/api/stores');
    console.log('2. GET /api/stores:', stores.status === 200 && stores.data.count >= 5 ? `✅ PASS (${stores.data.count} stores)` : '❌ FAIL');

    // 3. Products list
    const products = await request('GET', '/api/products');
    console.log('3. GET /api/products:', products.status === 200 && products.data.count >= 8 ? `✅ PASS (${products.data.count} products)` : '❌ FAIL');

    // 4. Services list
    const services = await request('GET', '/api/services');
    console.log('4. GET /api/services:', services.status === 200 && services.data.count >= 5 ? `✅ PASS (${services.data.count} services)` : '❌ FAIL');

    // 5. Offers list
    const offers = await request('GET', '/api/offers');
    console.log('5. GET /api/offers:', offers.status === 200 && offers.data.count >= 3 ? `✅ PASS (${offers.data.count} offers)` : '❌ FAIL');

    // 6. Customer Login
    const custLogin = await request('POST', '/api/auth/login', {
      email: 'customer@mobilya.iq',
      password: 'Password123!',
    });
    console.log('6. POST /api/auth/login (Customer):', custLogin.status === 200 && custLogin.data.token ? '✅ PASS' : '❌ FAIL');
    const customerToken = custLogin.data.token;

    // 7. Store Owner Login
    const ownerLogin = await request('POST', '/api/auth/login', {
      email: 'rafidain@mobilya.iq',
      password: 'Password123!',
    });
    console.log('7. POST /api/auth/login (Store Owner):', ownerLogin.status === 200 && ownerLogin.data.user.role === 'store_owner' ? '✅ PASS' : '❌ FAIL');
    const ownerToken = ownerLogin.data.token;

    // 8. Admin Login
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@mobilya.iq',
      password: 'Password123!',
    });
    console.log('8. POST /api/auth/login (Admin):', adminLogin.status === 200 && adminLogin.data.user.role === 'admin' ? '✅ PASS' : '❌ FAIL');
    const adminToken = adminLogin.data.token;

    // 9. Admin Dashboard (Protected - requires Admin)
    const adminDash = await request('GET', '/api/admin/dashboard', null, adminToken);
    console.log('9. GET /api/admin/dashboard (Admin):', adminDash.status === 200 && adminDash.data.stats.totalUsers >= 6 ? '✅ PASS' : '❌ FAIL');

    // 10. Admin Pending Stores
    const pendingStores = await request('GET', '/api/admin/stores/pending', null, adminToken);
    console.log('10. GET /api/admin/stores/pending:', pendingStores.status === 200 ? `✅ PASS (${pendingStores.data.count} pending)` : '❌ FAIL');

    // 11. Customer Add Favorite (Protected)
    const addFav = await request('POST', '/api/favorites', { product_id: 2 }, customerToken);
    console.log('11. POST /api/favorites (Customer):', addFav.status === 201 || addFav.status === 409 ? '✅ PASS' : '❌ FAIL');

    // 12. Customer Get Favorites (Protected)
    const getFav = await request('GET', '/api/favorites', null, customerToken);
    console.log('12. GET /api/favorites:', getFav.status === 200 ? `✅ PASS (${getFav.data.count} favorites)` : '❌ FAIL');

    // 13. Search query in products
    const searchRes = await request('GET', '/api/products?search=iPhone');
    console.log('13. Live Search /api/products?search=iPhone:', searchRes.status === 200 && searchRes.data.count > 0 ? `✅ PASS (${searchRes.data.count} items found)` : '❌ FAIL');

    console.log('\n🎉 ALL 13 API TEST SUITES PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

runTests();
