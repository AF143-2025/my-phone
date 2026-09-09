/**
 * Mobilya Platform - Executive Client-Side Logic & Dynamic API Integration
 * سوق الموبايلات في قضاء أبو غريب — مربوط بقاعدة بيانات PostgreSQL و REST API
 */

(function () {
  const state = {
    currentUser: null,
    currentRegion: 'أبو غريب - أبو منيصير',
    categories: [],
    stores: [],
    products: [],
    offers: [],
    services: [],
    favorites: [],
    activeStore: null,
    selectedCalcDevice: 'ip16pm',
    selectedCalcServiceId: null,
  };

  // Helper: Format Iraqi Dinar
  function formatIQD(num) {
    if (!num && num !== 0) return '';
    return new Intl.NumberFormat('en-US').format(Math.round(num)) + ' د.ع';
  }

  // Toast Notification Helper
  function showToast(msg, type = 'info') {
    alert(msg);
  }

  // ==================== APP INITIALIZATION ====================
  async function initApp() {
    console.log('🚀 Initializing Mobilya Full-Stack Application...');

    // 1. Sync User Session
    if (window.API && window.API.isLoggedIn()) {
      try {
        state.currentUser = await window.API.getMe();
      } catch {
        state.currentUser = window.API.getUser();
      }
    } else if (window.API) {
      state.currentUser = window.API.getUser();
    }

    renderHeaderAuth();
    startCountdown();

    // 2. Fetch Live Data from PostgreSQL via REST API
    await Promise.allSettled([
      fetchAndRenderCategories(),
      fetchAndRenderStores(),
      fetchAndRenderProducts(),
      fetchAndRenderOffers(),
      fetchAndRenderServices(),
      fetchAndRenderFavorites(),
    ]);

    renderMarketPrices();
    renderReviews();
    setupCalcEvents();
  }

  // ==================== 1. AUTHENTICATION & HEADER UI ====================
  function renderHeaderAuth() {
    const container = document.getElementById('header-auth-container');
    if (!container) return;

    if (state.currentUser) {
      const u = state.currentUser;
      const roleBadge =
        u.role === 'admin'
          ? '<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">👑 مدير</span>'
          : u.role === 'store_owner'
          ? '<span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">🏪 متجر</span>'
          : '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">👤 زبون</span>';

      let dashboardBtn = '';
      if (u.role === 'admin') {
        dashboardBtn = `
          <button onclick="window.MobilyaApp.openAdminDashboard()" class="px-3 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1">
            <span>👑</span>
            <span>لوحة الإدارة</span>
          </button>
        `;
      } else if (u.role === 'store_owner') {
        dashboardBtn = `
          <button onclick="window.MobilyaApp.openStoreDashboard()" class="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1">
            <span>🏪</span>
            <span>لوحة المحل</span>
          </button>
        `;
      }

      container.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="text-right hidden sm:block">
            <span class="text-xs font-bold text-white block">${u.name}</span>
            <div class="flex items-center gap-1">${roleBadge}</div>
          </div>
          ${dashboardBtn}
          <button onclick="window.MobilyaApp.handleLogout()" class="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-white text-xs font-bold">
            خروج 🚪
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button onclick="window.MobilyaApp.openAuthModal('login')" class="px-3.5 py-2 rounded-xl btn-glass-secondary text-xs text-slate-200 font-semibold hover:border-purple-500">
          👤 تسجيل الدخول
        </button>
        <button onclick="window.MobilyaApp.openAuthModal('register')" class="flex items-center gap-1.5 py-2 px-3.5 rounded-xl btn-electric text-xs font-bold glowing-ring">
          <span>+</span>
          <span>أضف محلك</span>
        </button>
      `;
    }
  }

  // ==================== 2. CATEGORIES ====================
  async function fetchAndRenderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    try {
      if (window.API) {
        state.categories = await window.API.getCategories();
      }
    } catch {
      state.categories = window.MobilyaData?.categories || [];
    }

    grid.innerHTML = state.categories
      .map(
        (c) => `
      <div onclick="window.MobilyaApp.filterCategory(${c.id}, '${c.name}')" 
           class="p-4 rounded-2xl glass-card text-center cursor-pointer group hover:scale-[1.03] transition-all border border-slate-800/80 hover:border-purple-500/50">
        <div class="w-12 h-12 mx-auto rounded-2xl bg-slate-900/80 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-transform">
          ${c.icon}
        </div>
        <h4 class="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">${c.name}</h4>
        <span class="text-[10px] text-slate-400 block mt-1">${c.products_count || 0} منتج متوفر</span>
      </div>
    `
      )
      .join('');
  }

  // ==================== 3. STORES ====================
  async function fetchAndRenderStores(location = null) {
    const grid = document.getElementById('featured-stores-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="col-span-3 text-center py-8 text-slate-400 text-xs">جاري جلب المحلات المعتمدة من قاعدة البيانات...</div>';

    try {
      if (window.API) {
        state.stores = await window.API.getStores({ location });
      }
    } catch {
      state.stores = window.MobilyaData?.stores || [];
    }

    // Sync live store count everywhere
    const kpiStoresEl = document.getElementById('hero-kpi-stores-count');
    if (kpiStoresEl) kpiStoresEl.textContent = state.stores ? state.stores.length : 0;
    const labelStoresEl = document.getElementById('featured-stores-count-label');
    if (labelStoresEl) labelStoresEl.textContent = `عرض المحلات المعتمدة (${state.stores ? state.stores.length : 0} محلات) ←`;

    if (!state.stores || state.stores.length === 0) {
      grid.innerHTML = '<div class="col-span-3 text-center py-8 text-slate-400 text-xs">لا توجد محلات معتمدة في هذا الحي حالياً.</div>';
      return;
    }

    grid.innerHTML = state.stores
      .map((store) => {
        const verifiedBadge = store.verified
          ? `<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
              <span>✓</span><span>موثق رسمياً</span>
            </span>`
          : '';

        return `
        <div class="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-start justify-between gap-3 mb-3">
              <div class="flex items-center gap-3">
                <img src="${store.logo || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200'}" alt="${store.name}" class="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                <div>
                  <h3 class="font-extrabold text-sm text-white hover:text-purple-300 transition-colors cursor-pointer" onclick="window.MobilyaApp.openStoreDetails(${store.id})">
                    ${store.name}
                  </h3>
                  <div class="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>📍</span>
                    <span>${store.location}</span>
                  </div>
                  <div class="flex items-center gap-1.5 mt-1 text-xs">
                    <span class="text-amber-400 font-bold flex items-center gap-0.5">
                      <span>★</span>
                      <span>${store.avg_rating ? Number(store.avg_rating).toFixed(1) : '5.0'}</span>
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono">(${store.reviews_count || 0} تقييم)</span>
                  </div>
                </div>
              </div>
              ${verifiedBadge}
            </div>

            <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
              ${store.description || 'مركز متخصص بالأجهزة الذكية والصيانة المعتمدة في قضاء أبو غريب.'}
            </p>

            <div class="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 mb-2">
              <div>
                <span class="text-slate-400 block text-[10px]">الهواتف المعروضة:</span>
                <span class="font-bold text-white font-mono">${store.products_count || 0} جهاز</span>
              </div>
              <div>
                <span class="text-slate-400 block text-[10px]">خدمات الصيانة:</span>
                <span class="font-bold text-cyan-300 font-mono">${store.services_count || 0} خدمة</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-2 border-t border-slate-800/80">
            <button onclick="window.MobilyaApp.contactStoreWhatsApp(${store.id})" class="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
              <span>واتساب</span>
              <span>💬</span>
            </button>
            <button onclick="window.MobilyaApp.openStoreDetails(${store.id})" class="px-3.5 py-2 rounded-xl btn-glass-secondary text-xs font-semibold">
              تصفح المحل ←
            </button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  // ==================== 4. PRODUCTS & LIVE SEARCH ====================
  async function fetchAndRenderProducts(params = {}) {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="col-span-6 text-center py-8 text-slate-400 text-xs">جاري جلب الأجهزة من محلات أبو غريب...</div>';

    try {
      if (window.API) {
        state.products = await window.API.getProducts(params);
      }
    } catch {
      state.products = window.MobilyaData?.products || [];
    }

    if (!state.products || state.products.length === 0) {
      grid.innerHTML = '<div class="col-span-6 text-center py-8 text-slate-400 text-xs">لم يتم العثور على أجهزة مطابقة في محلات أبو غريب.</div>';
      return;
    }

    grid.innerHTML = state.products
      .map((p) => {
        const isFav = state.favorites.some((f) => f.product_id === p.id || f.id === p.id);
        const availBadge =
          p.availability === 'available'
            ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">متوفر</span>'
            : p.availability === 'limited'
            ? '<span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">كمية محدودة</span>'
            : '<span class="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">غير متوفر</span>';

        return `
        <div class="glass-card rounded-2xl p-3.5 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 group">
          <div class="relative overflow-hidden rounded-xl bg-slate-900 aspect-square flex items-center justify-center p-2">
            <img src="${p.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'}" alt="${p.name}" class="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" />
            <button onclick="window.MobilyaApp.toggleFavorite(${p.id}, event)" class="absolute top-2 left-2 w-7 h-7 rounded-full bg-slate-950/80 border border-slate-700/80 text-xs flex items-center justify-center hover:scale-110 transition-transform ${isFav ? 'text-rose-500 font-bold' : 'text-slate-400'}">
              ${isFav ? '❤️' : '♡'}
            </button>
            <div class="absolute bottom-2 right-2">
              ${availBadge}
            </div>
          </div>

          <div class="space-y-1">
            <div class="text-[10px] text-purple-400 font-bold">${p.category_name || 'هواتف'}</div>
            <h4 class="text-xs font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">${p.name}</h4>
            <div onclick="window.MobilyaApp.openStoreDetails(${p.store_id})" class="text-[10px] text-slate-400 hover:text-purple-300 transition-colors cursor-pointer truncate" title="تصفح هذا المحل">🏪 ${p.store_name} — ${p.store_location || 'أبو غريب'}</div>
          </div>

          <div class="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
            <div class="text-xs font-black text-cyan-300 font-mono">
              ${formatIQD(p.price)}
            </div>
            <button onclick="window.MobilyaApp.orderProductWhatsApp(${p.id})" class="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
              <span>طلب</span>
              <span>💬</span>
            </button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  // ==================== 5. OFFERS & FLASH DEALS ====================
  async function fetchAndRenderOffers() {
    const grid = document.getElementById('flash-deals-grid');
    if (!grid) return;

    try {
      if (window.API) {
        state.offers = await window.API.getOffers();
      }
    } catch {
      state.offers = window.MobilyaData?.flashDeals || [];
    }

    if (!state.offers || state.offers.length === 0) return;

    grid.innerHTML = state.offers
      .map(
        (deal) => `
      <div class="glass-card p-4 rounded-2xl border border-rose-500/30 hover:border-rose-500/60 transition-all flex flex-col justify-between space-y-3">
        <div class="relative overflow-hidden rounded-xl bg-slate-900 aspect-video flex items-center justify-center p-2">
          <img src="${deal.image_url || 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600'}" alt="${deal.product_name}" class="object-contain w-full h-full" />
          <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">
            خصم ${deal.discount_percentage}%
          </span>
        </div>

        <div>
          <h4 class="text-xs font-bold text-white mb-1 line-clamp-1">${deal.product_name}</h4>
          <span class="text-[10px] text-slate-400 block mb-2">🏪 ${deal.store_name} — ${deal.store_location || 'أبو غريب'}</span>

          <div class="flex items-baseline gap-2 mb-2">
            <span class="text-sm font-black text-rose-400 font-mono">${formatIQD(deal.new_price)}</span>
            ${deal.old_price ? `<span class="text-[10px] text-slate-500 line-through font-mono">${formatIQD(deal.old_price)}</span>` : ''}
          </div>

          <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div class="bg-rose-500 h-full rounded-full" style="width: 80%"></div>
          </div>
          <span class="text-[9px] text-slate-400 block mt-1">تم حجز 80% من الكمية المتوفرة</span>
        </div>

        <button onclick="window.MobilyaApp.orderDealWhatsApp(${deal.id})" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20">
          <span>حجز العرض الآن عبر الواتساب</span>
          <span>💬</span>
        </button>
      </div>
    `
      )
      .join('');
  }

  // ==================== 6. MAINTENANCE SERVICES & CALCULATOR ====================
  async function fetchAndRenderServices() {
    const select = document.getElementById('calc-issue-select');
    const deviceSelect = document.getElementById('calc-device-select');
    if (!select || !deviceSelect) return;

    try {
      if (window.API) {
        state.services = await window.API.getServices();
      }
    } catch {
      state.services = [];
    }

    // Populate device select
    deviceSelect.innerHTML = `
      <option value="ip16pm|1.0">iPhone 16 Pro Max</option>
      <option value="ip15p|0.88">iPhone 15 Pro</option>
      <option value="ip14|0.65">iPhone 14 / 13</option>
      <option value="s24u|1.02">Samsung Galaxy S24 Ultra</option>
      <option value="s23fe|0.75">Samsung Galaxy S23 FE</option>
      <option value="redmi|0.45">Xiaomi Redmi Note 13 Pro</option>
    `;

    if (state.services && state.services.length > 0) {
      select.innerHTML = state.services
        .map(
          (s) => `
        <option value="${s.id}|${s.price}|${s.name}">${s.name} (~ ${formatIQD(s.price)})</option>
      `
        )
        .join('');
    } else {
      select.innerHTML = `
        <option value="1|185000|تبديل شاشة أصلية OLED">تبديل شاشة أصلية OLED</option>
        <option value="2|55000|تبديل بطارية أصلية">تبديل بطارية أصلية</option>
        <option value="3|25000|تصليح مدخل الشحن">تصليح مدخل الشحن</option>
      `;
    }

    updateCalcResult();
  }

  function setupCalcEvents() {
    const dev = document.getElementById('calc-device-select');
    const iss = document.getElementById('calc-issue-select');
    if (dev) dev.addEventListener('change', updateCalcResult);
    if (iss) iss.addEventListener('change', updateCalcResult);
  }

  function updateCalcResult() {
    const dev = document.getElementById('calc-device-select');
    const iss = document.getElementById('calc-issue-select');
    if (!dev || !iss) return;

    const [devKey, devMultStr] = (dev.value || 'ip16pm|1.0').split('|');
    const [srvId, basePriceStr, srvName] = (iss.value || '1|185000|شاشة').split('|');

    const devMult = parseFloat(devMultStr) || 1.0;
    const basePrice = parseFloat(basePriceStr) || 185000;
    const calculated = Math.round(basePrice * devMult);

    const priceEl = document.getElementById('calc-price-result');
    const summaryEl = document.getElementById('calc-summary-device');
    if (priceEl) priceEl.innerText = formatIQD(calculated);
    if (summaryEl) summaryEl.innerText = `${dev.options[dev.selectedIndex].text} — ${srvName || 'صيانة'}`;
  }

  // ==================== 7. FAVORITES ====================
  async function fetchAndRenderFavorites() {
    if (!window.API || !window.API.isLoggedIn()) return;

    try {
      state.favorites = await window.API.getFavorites();
      updateFavBadge();
    } catch {
      state.favorites = [];
    }
  }

  function updateFavBadge() {
    document.querySelectorAll('.fav-count-badge').forEach((el) => {
      el.textContent = state.favorites.length;
    });
  }

  // ==================== 8. STATIC DATA (Market Index & Reviews) ====================
  function renderMarketPrices() {
    const tbody = document.getElementById('market-price-table-body');
    if (!tbody) return;

    const prices = window.MobilyaData?.marketPriceIndex || [
      { device: 'iPhone 16 Pro Max 256GB', minPrice: 1720000, avgPrice: 1750000, maxPrice: 1790000, storesCount: 9, trendLabel: 'استقرار في السعر' },
      { device: 'Samsung Galaxy S24 Ultra 256GB', minPrice: 1390000, avgPrice: 1425000, maxPrice: 1460000, storesCount: 7, trendLabel: 'انخفاض 2%' },
      { device: 'iPhone 15 Pro 128GB', minPrice: 1310000, avgPrice: 1340000, maxPrice: 1370000, storesCount: 11, trendLabel: 'استقرار' },
      { device: 'Xiaomi Redmi Note 13 Pro 512GB', minPrice: 345000, avgPrice: 360000, maxPrice: 380000, storesCount: 14, trendLabel: 'طلب مرتفع' },
    ];

    tbody.innerHTML = prices
      .map(
        (p) => `
      <tr class="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
        <td class="py-3.5 pr-2 font-bold text-white">${p.device}</td>
        <td class="py-3.5 text-center text-emerald-400 font-bold font-mono">${formatIQD(p.minPrice)}</td>
        <td class="py-3.5 text-center text-cyan-300 font-bold font-mono">${formatIQD(p.avgPrice)}</td>
        <td class="py-3.5 text-center text-slate-400 font-mono">${formatIQD(p.maxPrice)}</td>
        <td class="py-3.5 text-center">
          <span class="px-2.5 py-0.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold">
            ${p.storesCount} محل في أبو غريب
          </span>
        </td>
        <td class="py-3.5 pl-2 text-left text-xs text-emerald-400">${p.trendLabel}</td>
      </tr>
    `
      )
      .join('');
  }

  function renderReviews() {
    const grid = document.getElementById('customer-reviews-grid');
    if (!grid) return;

    const reviews = window.MobilyaData?.customerReviews || [
      { author: 'حيدر الكرخي', location: 'أبو غريب - الشارع العام', text: 'صلحت شاشة آيفون 15 برو عند مركز الرافدين بعد المقارنة في المنصة، الصيانة أصلية وبنصف ساعة واستلمت الجهاز مع ضمان 6 أشهر.', rating: 5, date: 'قبل يومين' },
      { author: 'م. أحمد الجميلي', location: 'أبو غريب - شارع الزيتون', text: 'فكرة المنصة أسطورية وتوفر وقت وفرة بالمحلات. قارنت أسعار S24 Ultra واشتريته من أقرب محل لي بأفضل سعر بالدينار.', rating: 5, date: 'قبل 4 أيام' },
      { author: 'سيف العبيدي', location: 'أبو غريب - حي الشهداء', text: 'أخذت خط مميز آسيا سيل من ركن الاتصالات وتواصلت معهم واتساب فوراً وحجزت الرقم قبل لا ينباع. خدمة سريعة وممتازة.', rating: 5, date: 'قبل أسبوع' },
    ];

    grid.innerHTML = reviews
      .map(
        (r) => `
      <div class="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="text-xs font-bold text-white">${r.author}</h4>
            <span class="text-[10px] text-slate-400">📍 ${r.location}</span>
          </div>
          <span class="text-amber-400 text-xs">★★★★★</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">${r.text}</p>
        <span class="text-[10px] text-slate-500 block pt-2 border-t border-slate-800/60">${r.date}</span>
      </div>
    `
      )
      .join('');
  }

  function startCountdown() {
    let secs = 45 * 60 + 30;
    setInterval(() => {
      secs--;
      if (secs < 0) secs = 86400;
      const h = String(Math.floor(secs / 3600)).padStart(2, '0');
      const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      document.querySelectorAll('.timer-hours').forEach((el) => (el.textContent = h));
      document.querySelectorAll('.timer-mins').forEach((el) => (el.textContent = m));
      document.querySelectorAll('.timer-secs').forEach((el) => (el.textContent = s));
    }, 1000);
  }

  // ==================== PUBLIC MOBILYA CONTROLLER ====================
  window.MobilyaApp = {
    // Navigation
    goHome: () => {
      document.querySelectorAll('.view-container').forEach((v) => v.classList.remove('active-view'));
      document.getElementById('view-home')?.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    scrollToSection: (id) => {
      window.MobilyaApp.goHome();
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    },

    // Search & Filter
    quickSearch: (term) => {
      if (!term) return;
      window.MobilyaApp.scrollToSection('products-section');
      fetchAndRenderProducts({ search: term });
    },

    filterCategory: (categoryId, categoryName) => {
      window.MobilyaApp.scrollToSection('products-section');
      fetchAndRenderProducts({ category_id: categoryId });
      showToast(`📂 تم تصفية المنتجات لقسم: (${categoryName})`);
    },

    selectRegion: (region) => {
      state.currentRegion = region;
      document.querySelectorAll('.current-region-label').forEach((el) => (el.textContent = region));
      window.MobilyaApp.closeRegionModal();
      fetchAndRenderStores(region.includes('الشارع العام') ? 'الشارع العام' : region);
      showToast(`📍 تم ضبط المنطقة على: ${region}`);
    },

    // Favorites
    toggleFavorite: async (productId, e) => {
      if (e) e.stopPropagation();

      if (!window.API || !window.API.isLoggedIn()) {
        showToast('يرجى تسجيل الدخول أولاً لإضافة المنتجات إلى مفضلتك.');
        window.MobilyaApp.openAuthModal('login');
        return;
      }

      const isFav = state.favorites.some((f) => f.product_id === productId || f.id === productId);
      try {
        if (isFav) {
          await window.API.removeFavorite(productId);
          state.favorites = state.favorites.filter((f) => f.product_id !== productId && f.id !== productId);
          showToast('تمت الإزالة من المفضلة.');
        } else {
          await window.API.addFavorite(productId);
          await fetchAndRenderFavorites();
          showToast('❤️ تمت الإضافة إلى قائمة المفضلة!');
        }
        updateFavBadge();
        fetchAndRenderProducts();
      } catch (err) {
        showToast(err.message);
      }
    },

    // Modals
    openAuthModal: (tab = 'login') => {
      document.getElementById('auth-modal')?.classList.remove('hidden');
      window.MobilyaApp.switchAuthTab(tab);
    },

    closeAuthModal: () => {
      document.getElementById('auth-modal')?.classList.add('hidden');
    },

    switchAuthTab: (tab) => {
      const loginTab = document.getElementById('tab-auth-login');
      const regTab = document.getElementById('tab-auth-register');
      const loginForm = document.getElementById('form-login');
      const regForm = document.getElementById('form-register');
      const title = document.getElementById('auth-modal-title');

      if (tab === 'login') {
        loginTab?.classList.add('bg-purple-600', 'text-white');
        loginTab?.classList.remove('text-slate-400');
        regTab?.classList.remove('bg-purple-600', 'text-white');
        regTab?.classList.add('text-slate-400');
        loginForm?.classList.remove('hidden');
        regForm?.classList.add('hidden');
        if (title) title.textContent = 'تسجيل الدخول إلى Mobilya 👋';
      } else {
        regTab?.classList.add('bg-purple-600', 'text-white');
        regTab?.classList.remove('text-slate-400');
        loginTab?.classList.remove('bg-purple-600', 'text-white');
        loginTab?.classList.add('text-slate-400');
        regForm?.classList.remove('hidden');
        loginForm?.classList.add('hidden');
        if (title) title.textContent = 'إنشاء حساب جديد في قضاء أبو غريب 🚀';
      }
    },

    // Real API Auth Handlers
    handleLogin: async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value.trim();
      const password = document.getElementById('login-password')?.value;

      try {
        const res = await window.API.login(email, password);
        state.currentUser = res.user;
        renderHeaderAuth();
        window.MobilyaApp.closeAuthModal();
        showToast(res.message || 'تم تسجيل الدخول بنجاح!');
        fetchAndRenderFavorites();

        // Redirect if store owner or admin
        if (res.user.role === 'admin') {
          window.MobilyaApp.openAdminDashboard();
        } else if (res.user.role === 'store_owner') {
          window.MobilyaApp.openStoreDashboard();
        }
      } catch (err) {
        showToast('خطأ في تسجيل الدخول: ' + err.message);
      }
    },

    handleRegister: async (e) => {
      e.preventDefault();
      const role = document.querySelector('input[name="reg-role"]:checked')?.value || 'customer';
      const name = document.getElementById('reg-name')?.value.trim();
      const email = document.getElementById('reg-email')?.value.trim();
      const phone = document.getElementById('reg-phone')?.value.trim();
      const password = document.getElementById('reg-password')?.value;

      try {
        const res = await window.API.register({ name, email, phone, password, role });
        state.currentUser = res.user;
        renderHeaderAuth();
        window.MobilyaApp.closeAuthModal();
        showToast(res.message || 'تم إنشاء الحساب بنجاح!');

        if (res.user.role === 'store_owner') {
          window.MobilyaApp.openStoreDashboard();
        }
      } catch (err) {
        showToast('خطأ في إنشاء الحساب: ' + err.message);
      }
    },

    quickLoginDemo: async (role) => {
      const emailMap = {
        admin: 'admin@mobilya.iq',
        store_owner: 'rafidain@mobilya.iq',
        customer: 'customer@mobilya.iq',
      };
      const email = emailMap[role] || 'customer@mobilya.iq';
      try {
        const res = await window.API.login(email, 'Password123!');
        state.currentUser = res.user;
        renderHeaderAuth();
        window.MobilyaApp.closeAuthModal();
        showToast(`مرحباً! تم تسجيل الدخول بنجاح كـ (${res.user.name})`);
        if (role === 'admin') window.MobilyaApp.openAdminDashboard();
        else if (role === 'store_owner') window.MobilyaApp.openStoreDashboard();
      } catch (err) {
        showToast(err.message);
      }
    },

    handleLogout: async () => {
      await window.API.logout();
      state.currentUser = null;
      renderHeaderAuth();
      window.MobilyaApp.goHome();
      showToast('تم تسجيل الخروج بنجاح.');
    },

    openRegionModal: () => document.getElementById('region-modal')?.classList.remove('hidden'),
    closeRegionModal: () => document.getElementById('region-modal')?.classList.add('hidden'),
    selectRegion: (regionName) => {
      state.currentRegion = regionName;
      document.querySelectorAll('.current-region-label').forEach((el) => {
        el.textContent = regionName;
      });
      window.MobilyaApp.closeRegionModal();
      showToast(`📍 المنطقة المعتمدة: ${regionName}`);
    },

    openNotificationsModal: () => {
      showToast('🔔 مركز التنبيهات في قضاء أبو غريب:\n1. 🔥 خصم فوري 22% على سماعات AirPods Pro 2 في مركز الرافدين.\n2. 📱 وصول دفعة هواتف iPhone 16 Pro Max جديدة.\n3. ✅ تم اعتماد مركز قمة التقنية للصيانة في شارع الزيتون.');
    },

    // ==================== STORE OWNER DASHBOARD ====================
    openStoreDashboard: async () => {
      if (!state.currentUser || (state.currentUser.role !== 'store_owner' && state.currentUser.role !== 'admin')) {
        showToast('يرجى تسجيل الدخول بحساب صاحب متجر لعرض لوحة التحكم.');
        window.MobilyaApp.openAuthModal('login');
        return;
      }

      document.querySelectorAll('.view-container').forEach((v) => v.classList.remove('active-view'));
      document.getElementById('view-store-dashboard')?.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      await window.MobilyaApp.refreshStoreDashboard();
    },

    refreshStoreDashboard: async () => {
      const u = state.currentUser;
      const storeNameEl = document.getElementById('dash-store-name');
      const storeBadgeEl = document.getElementById('dash-store-status-badge');
      const storeDescEl = document.getElementById('dash-store-desc');

      let userStore = u.store;
      if (!userStore && state.stores.length > 0) {
        userStore = state.stores.find((s) => s.owner_id === u.id) || state.stores[0];
      }

      if (userStore) {
        if (storeNameEl) storeNameEl.textContent = `متجر: ${userStore.name}`;
        if (storeDescEl) storeDescEl.textContent = `الموقع: ${userStore.location || 'أبو غريب'} | رقم التواصل: ${userStore.phone || '0770...'}`;
        if (storeBadgeEl) {
          storeBadgeEl.textContent = userStore.status === 'approved' ? '🟢 متجر معتمد ونشط' : '⏳ قيد مراجعة الإدارة';
        }

        // Fetch store products & services
        try {
          const storeDetails = await window.API.getStoreById(userStore.id);
          const products = storeDetails.products || [];
          const services = storeDetails.services || [];

          document.getElementById('dash-kpi-products').textContent = products.length;
          document.getElementById('dash-kpi-services').textContent = services.length;

          const tbody = document.getElementById('store-products-table-body');
          if (tbody) {
            tbody.innerHTML = products
              .map(
                (p) => `
              <tr class="hover:bg-slate-900/40 transition-colors">
                <td class="py-3 font-bold text-white flex items-center gap-2">
                  <img src="${p.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'}" class="w-8 h-8 rounded-lg object-contain bg-slate-900" />
                  <span>${p.name}</span>
                </td>
                <td class="py-3 text-center text-purple-300">${p.category_name || 'عام'}</td>
                <td class="py-3 text-center text-cyan-300 font-mono font-bold">${formatIQD(p.price)}</td>
                <td class="py-3 text-center text-emerald-400">${p.availability === 'available' ? 'متوفر' : 'كمية محدودة'}</td>
                <td class="py-3 text-left">
                  <button onclick="window.MobilyaApp.deleteProduct(${p.id})" class="px-2.5 py-1 rounded bg-rose-600/20 text-rose-400 hover:bg-rose-600/40 text-[11px] font-bold">
                    حذف 🗑️
                  </button>
                </td>
              </tr>
            `
              )
              .join('');
          }
        } catch (err) {
          console.error(err);
        }
      }
    },

    submitNewProduct: async (e) => {
      e.preventDefault();
      const name = document.getElementById('prod-name')?.value.trim();
      const category_id = parseInt(document.getElementById('prod-category')?.value, 10) || 1;
      const price = parseFloat(document.getElementById('prod-price')?.value);
      const availability = document.getElementById('prod-availability')?.value || 'available';
      const image_url = document.getElementById('prod-image')?.value.trim();
      const description = document.getElementById('prod-desc')?.value.trim();

      try {
        const res = await window.API.createProduct({
          name,
          category_id,
          price,
          availability,
          image_url,
          description,
        });

        showToast('🎉 ' + (res.message || 'تم نشر المنتج بنجاح!'));
        document.getElementById('form-add-product')?.reset();
        await window.MobilyaApp.refreshStoreDashboard();
        fetchAndRenderProducts();
      } catch (err) {
        showToast('خطأ في إضافة المنتج: ' + err.message);
      }
    },

    submitNewService: async (e) => {
      e.preventDefault();
      const name = document.getElementById('srv-name')?.value.trim();
      const price = parseFloat(document.getElementById('srv-price')?.value);
      const description = document.getElementById('srv-desc')?.value.trim();

      try {
        const res = await window.API.createService({ name, price, description });
        showToast('🛠️ ' + (res.message || 'تمت إضافة خدمة الصيانة بنجاح!'));
        document.getElementById('form-add-service')?.reset();
        await window.MobilyaApp.refreshStoreDashboard();
        fetchAndRenderServices();
      } catch (err) {
        showToast('خطأ في إضافة الخدمة: ' + err.message);
      }
    },

    deleteProduct: async (productId) => {
      if (!confirm('هل أنت متأكد من رغبتك بحذف هذا المنتج من متجرك؟')) return;
      try {
        await window.API.deleteProduct(productId);
        showToast('تم حذف المنتج.');
        await window.MobilyaApp.refreshStoreDashboard();
        fetchAndRenderProducts();
      } catch (err) {
        showToast(err.message);
      }
    },

    // ==================== ADMIN DASHBOARD ====================
    openAdminDashboard: async () => {
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        showToast('يرجى تسجيل الدخول كمدير نظام للوصول إلى لوحة الإدارة.');
        window.MobilyaApp.openAuthModal('login');
        return;
      }

      document.querySelectorAll('.view-container').forEach((v) => v.classList.remove('active-view'));
      document.getElementById('view-admin-dashboard')?.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      await window.MobilyaApp.refreshAdminDashboard();
    },

    refreshAdminDashboard: async () => {
      try {
        const dashData = await window.API.getAdminDashboard();
        const pendingStores = await window.API.getAdminPendingStores();
        const allStores = await window.API.getStores();

        // Update KPIs
        const stats = dashData.stats || {};
        document.getElementById('admin-kpi-users').textContent = stats.totalUsers || 0;
        document.getElementById('admin-kpi-approved-stores').textContent = stats.totalApprovedStores || 0;
        document.getElementById('admin-kpi-pending-stores').textContent = stats.totalPendingStores || 0;
        document.getElementById('admin-kpi-products').textContent = stats.totalProducts || 0;
        document.getElementById('admin-kpi-services').textContent = stats.totalServices || 0;

        document.getElementById('admin-pending-count-badge').textContent = `${pendingStores.length} طلب`;

        // Render Pending Stores
        const pendingBody = document.getElementById('admin-pending-stores-body');
        if (pendingBody) {
          if (pendingStores.length === 0) {
            pendingBody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-slate-500 text-xs">لا توجد طلبات معلقة حالياً — كافة المحلات معتمدة وموثقة.</td></tr>';
          } else {
            pendingBody.innerHTML = pendingStores
              .map(
                (s) => `
              <tr class="hover:bg-slate-900/40 transition-colors">
                <td class="py-3 font-bold text-white">${s.name}</td>
                <td class="py-3 text-slate-300">${s.owner_name}</td>
                <td class="py-3 text-purple-300">📍 ${s.location}</td>
                <td class="py-3 font-mono text-slate-400">${s.phone}</td>
                <td class="py-3 text-left space-x-2">
                  <button onclick="window.MobilyaApp.adminApproveStore(${s.id})" class="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs ml-2">
                    ✅ قبول واعتماد
                  </button>
                  <button onclick="window.MobilyaApp.adminRejectStore(${s.id})" class="px-3 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/30 text-xs font-bold">
                    ❌ رفض
                  </button>
                </td>
              </tr>
            `
              )
              .join('');
          }
        }

        // Render Approved Stores for verification
        const approvedBody = document.getElementById('admin-approved-stores-body');
        if (approvedBody) {
          approvedBody.innerHTML = allStores
            .map(
              (s) => `
            <tr class="hover:bg-slate-900/40 transition-colors">
              <td class="py-3 font-bold text-white">${s.name}</td>
              <td class="py-3 text-slate-400">📍 ${s.location}</td>
              <td class="py-3 text-cyan-300 font-mono">${s.products_count || 0} جهاز</td>
              <td class="py-3 text-center">
                ${s.verified ? '<span class="text-emerald-400 font-bold">🛡️ موثق</span>' : '<span class="text-slate-500">غير موثق</span>'}
              </td>
              <td class="py-3 text-left">
                <button onclick="window.MobilyaApp.adminVerifyStore(${s.id})" class="px-2.5 py-1 rounded-lg ${s.verified ? 'bg-slate-800 text-slate-400' : 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40'} font-bold text-xs">
                  ${s.verified ? 'إلغاء التوثيق' : '🛡️ توثيق المحل'}
                </button>
              </td>
            </tr>
          `
            )
            .join('');
        }
      } catch (err) {
        console.error(err);
      }
    },

    adminApproveStore: async (storeId) => {
      try {
        const res = await window.API.approveStore(storeId);
        showToast(res.message || 'تم اعتماد المحل بنجاح!');
        await window.MobilyaApp.refreshAdminDashboard();
        fetchAndRenderStores();
      } catch (err) {
        showToast(err.message);
      }
    },

    adminRejectStore: async (storeId) => {
      const reason = prompt('يرجى كتابة سبب الرفض لصاحب المتجر (اختياري):', 'عدم توفر متطلبات التوثيق');
      if (reason === null) return;
      try {
        const res = await window.API.rejectStore(storeId, reason);
        showToast(res.message || 'تم رفض المتجر.');
        await window.MobilyaApp.refreshAdminDashboard();
      } catch (err) {
        showToast(err.message);
      }
    },

    adminVerifyStore: async (storeId) => {
      try {
        const res = await window.API.verifyStore(storeId);
        showToast(res.message || 'تم تحديث حالة التوثيق.');
        await window.MobilyaApp.refreshAdminDashboard();
        fetchAndRenderStores();
      } catch (err) {
        showToast(err.message);
      }
    },

    // WhatsApp Contact Actions
    contactStoreWhatsApp: (storeId) => {
      const store = state.stores.find((s) => s.id === storeId);
      const phone = store ? store.whatsapp || store.phone : '9647701112233';
      const msg = encodeURIComponent(`مرحباً ${store ? store.name : 'مركز الموبايل'}، رأيت متجركم على منصة Mobilya في قضاء أبو غريب وأود الاستفسار عن الأجهزة والخدمات.`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    },

    orderProductWhatsApp: (prodId) => {
      const prod = state.products.find((p) => p.id === prodId);
      if (!prod) return;
      const phone = prod.store_whatsapp || '9647701112233';
      const msg = encodeURIComponent(`مرحباً ${prod.store_name}، أنا مهتم بالطلب المباشر لجهاز (${prod.name}) بسعر ${formatIQD(prod.price)} عبر منصة Mobilya.`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    },

    orderDealWhatsApp: (dealId) => {
      const deal = state.offers.find((d) => d.id === dealId);
      if (!deal) return;
      const phone = deal.store_whatsapp || '9647701112233';
      const msg = encodeURIComponent(`مرحباً ${deal.store_name}، أرغب بحجز العرض الحصري (${deal.product_name}) بسعر ${formatIQD(deal.new_price)} عبر منصة Mobilya.`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    },

    bookMaintenanceWhatsApp: () => {
      const dev = document.getElementById('calc-device-select');
      const iss = document.getElementById('calc-issue-select');
      const price = document.getElementById('calc-price-result')?.innerText || '';
      const devName = dev ? dev.options[dev.selectedIndex].text : 'جهاز';
      const srvName = iss ? iss.options[iss.selectedIndex].text : 'صيانة';

      const msg = encodeURIComponent(`مرحباً مركز الصيانة في أبو غريب، أود حجز موعد صيانة لـ (${devName} - ${srvName}) بسعر ${price} عبر منصة Mobilya.`);
      window.open(`https://wa.me/9647703334455?text=${msg}`, '_blank');
    },

    // ==================== STORE FULL PAGE VIEW (عرض المحل الكامل على الشاشة) ====================
    openStoreDetails: async (storeId) => {
      // 1. Activate view-store-page and close any modal
      window.MobilyaApp.closeStoreDetails();
      document.querySelectorAll('.view-container').forEach((v) => v.classList.remove('active-view'));
      const storeView = document.getElementById('view-store-page');
      if (storeView) {
        storeView.classList.add('active-view');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // 2. Fetch full store data from API or state cache
      let store = null;
      try {
        if (window.API) {
          store = await window.API.getStoreById(storeId);
        }
      } catch (err) {
        console.warn('Could not fetch store from API, using state cache:', err);
      }

      if (!store) {
        store = state.stores.find((s) => s.id === storeId) || {
          id: storeId,
          name: 'متجر في أبو غريب',
          location: 'أبو غريب',
          products: [],
          services: [],
          offers: [],
        };
      }

      state.activeStore = store;

      // 3. Populate Hero & Cover Banner
      const logoEl = document.getElementById('store-page-logo');
      const nameEl = document.getElementById('store-page-name');
      const descEl = document.getElementById('store-page-desc');
      const locEl = document.getElementById('store-page-loc');
      const hoursEl = document.getElementById('store-page-hours');
      const phoneEl = document.getElementById('store-page-phone');
      const coverEl = document.getElementById('store-page-cover');
      const verifiedEl = document.getElementById('store-page-verified-badge');
      const waActionBtn = document.getElementById('store-page-wa-action');
      const callActionBtn = document.getElementById('store-page-call-action');
      const headerWaBtn = document.getElementById('store-page-header-wa-btn');

      const phoneRaw = (store.whatsapp || store.phone || '9647701112233').replace(/\D/g, '');
      const waMsg = encodeURIComponent(`مرحباً ${store.name}، رأيت متجركم على منصة Mobilya في قضاء أبو غريب وأود الاستفسار.`);
      const waUrl = `https://wa.me/${phoneRaw}?text=${waMsg}`;

      if (logoEl) logoEl.src = store.logo || 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200';
      if (nameEl) nameEl.textContent = store.name;
      if (descEl) descEl.textContent = store.description || 'مركز معتمد للأجهزة الذكية وخدمات الصيانة المعتمدة في قضاء أبو غريب.';
      if (locEl) locEl.innerHTML = `📍 <span class="text-white font-medium">${store.location || 'أبو غريب'}</span>`;
      if (hoursEl) hoursEl.innerHTML = `🕒 <span class="text-white font-medium">${store.opening_hours || '9:00 ص - 11:00 م'}</span>`;
      if (phoneEl) phoneEl.innerHTML = `📞 <span class="font-mono text-cyan-300">${store.phone || '0770...'}</span>`;
      if (coverEl && store.cover_image) {
        coverEl.style.backgroundImage = `url('${store.cover_image}')`;
      }
      if (verifiedEl) {
        verifiedEl.style.display = store.verified ? 'inline-flex' : 'none';
      }
      if (waActionBtn) waActionBtn.href = waUrl;
      if (callActionBtn) callActionBtn.href = `tel:${store.phone || ''}`;
      if (headerWaBtn) headerWaBtn.href = waUrl;

      // 4. Populate KPIs & Nav Counters
      const products = store.products || [];
      const services = store.services || [];
      const offers = store.offers || [];

      const kpiProds = document.getElementById('store-kpi-products');
      const kpiSrvs = document.getElementById('store-kpi-services');
      const kpiOffers = document.getElementById('store-kpi-offers');
      const kpiVer = document.getElementById('store-kpi-verified');
      const kpiRating = document.getElementById('store-kpi-rating');
      const kpiReviewsCount = document.getElementById('store-kpi-reviews-count');

      if (kpiProds) kpiProds.textContent = products.length;
      if (kpiSrvs) kpiSrvs.textContent = services.length;
      if (kpiOffers) kpiOffers.textContent = offers.length;
      if (kpiVer) kpiVer.textContent = store.verified ? 'معتمد وموثق 🛡️' : 'معتمد 🟢';
      if (kpiRating) kpiRating.textContent = store.avg_rating ? Number(store.avg_rating).toFixed(1) : '5.0';
      if (kpiReviewsCount) kpiReviewsCount.textContent = `(${store.reviews_count || 0} تقييم)`;

      const navProds = document.getElementById('store-nav-products-count');
      const navSrvs = document.getElementById('store-nav-services-count');
      const navOffers = document.getElementById('store-nav-offers-count');
      const navReviews = document.getElementById('store-nav-reviews-count');

      if (navProds) navProds.textContent = products.length;
      if (navSrvs) navSrvs.textContent = services.length;
      if (navOffers) navOffers.textContent = offers.length;
      if (navReviews) navReviews.textContent = store.reviews_count || 0;

      // Prefill customer name in review form if user is logged in
      const reviewNameInput = document.getElementById('review-customer-name');
      if (reviewNameInput) {
        reviewNameInput.value = state.currentUser ? state.currentUser.name : '';
      }
      const reviewCommentInput = document.getElementById('review-comment-text');
      if (reviewCommentInput) reviewCommentInput.value = '';
      window.MobilyaApp.setReviewRating(5);

      // Render Store Reviews
      window.MobilyaApp.renderStoreReviews(store);

      // Clear search input if previously used
      const searchInput = document.getElementById('store-product-search');
      if (searchInput) searchInput.value = '';

      // 5. Render Products Section
      window.MobilyaApp.renderStorePageProducts(products);

      // 6. Render Offers Section
      const offersGrid = document.getElementById('store-page-offers-grid');
      if (offersGrid) {
        if (offers.length === 0) {
          offersGrid.innerHTML = `
            <div class="col-span-full glass-card p-6 rounded-2xl text-center text-slate-400 text-xs border border-slate-800">
              <span class="text-2xl block mb-1">🏷️</span>
              لا توجد عروض ترويجية نشطة حالياً في هذا المتجر — تصفح الهواتف المتوفرة بالأسعار اليومية.
            </div>
          `;
        } else {
          offersGrid.innerHTML = offers.map((offer) => {
            const offerWaMsg = encodeURIComponent(`مرحباً ${store.name}، أرغب بحجز العرض الحصري (${offer.product_name || offer.title}) بسعر ${formatIQD(offer.new_price)} عبر منصة Mobilya.`);
            return `
              <div class="glass-card p-5 rounded-2xl border border-rose-500/40 hover:border-rose-500/70 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold inline-block mb-1">
                      🔥 خصم ${offer.discount_percentage}%
                    </span>
                    <h3 class="font-bold text-sm text-white">${offer.product_name || offer.title}</h3>
                  </div>
                  <span class="text-xs font-bold text-rose-400 font-mono bg-rose-950/60 px-2 py-1 rounded-lg">عرض خاص</span>
                </div>
                <div class="flex items-baseline gap-2 pt-2 border-t border-slate-800">
                  <span class="text-xs line-through text-slate-500 font-mono">${formatIQD(offer.old_price)}</span>
                  <span class="text-base font-black text-rose-400 font-mono">${formatIQD(offer.new_price)}</span>
                </div>
                <a href="https://wa.me/${phoneRaw}?text=${offerWaMsg}" target="_blank" class="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 hover:opacity-95 transition-opacity">
                  <span>حجز العرض بالواتساب</span>
                  <span>💬</span>
                </a>
              </div>
            `;
          }).join('');
        }
      }

      // 7. Render Services Section
      const servicesGrid = document.getElementById('store-page-services-grid');
      if (servicesGrid) {
        if (services.length === 0) {
          servicesGrid.innerHTML = `
            <div class="col-span-full glass-card p-6 rounded-2xl text-center text-slate-400 text-xs border border-slate-800">
              <span class="text-2xl block mb-1">🛠️</span>
              لا تتوفر خدمات صيانة منفصلة مسجلة لهذا المتجر حالياً.
            </div>
          `;
        } else {
          servicesGrid.innerHTML = services.map((s) => {
            const srvWaMsg = encodeURIComponent(`مرحباً ${store.name}، أود حجز موعد صيانة لخدمة (${s.name}) بسعر ${formatIQD(s.price)} عبر منصة Mobilya.`);
            return `
              <div class="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4">
                <div class="flex items-start gap-3">
                  <div class="w-11 h-11 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 flex items-center justify-center text-xl flex-shrink-0">
                    🛠️
                  </div>
                  <div>
                    <h4 class="font-bold text-sm text-white">${s.name}</h4>
                    <p class="text-xs text-slate-300 mt-1 leading-relaxed">${s.description || 'صيانة تخصصية فورية بقطع أصلية وضمان فحص معتمد.'}</p>
                    ${s.duration_minutes ? `<span class="inline-block mt-2 text-[10px] text-cyan-300 bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-500/20">⏱️ يستغرق تقريباً ${s.duration_minutes} دقيقة</span>` : ''}
                  </div>
                </div>
                <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                  <div class="text-sm font-black text-cyan-300 font-mono">${formatIQD(s.price)}</div>
                  <a href="https://wa.me/${phoneRaw}?text=${srvWaMsg}" target="_blank" class="py-2 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <span>حجز موعد بالواتساب</span>
                    <span>💬</span>
                  </a>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 8. Populate Location & Info Section
      const infoAddress = document.getElementById('store-info-address');
      const infoLandmark = document.getElementById('store-info-landmark');
      const infoHours = document.getElementById('store-info-hours');
      const infoPhone = document.getElementById('store-info-phone');
      const infoWaBtn = document.getElementById('store-info-wa-btn');
      const infoCallBtn = document.getElementById('store-info-call-btn');

      if (infoAddress) infoAddress.textContent = store.address || store.location || 'قضاء أبو غريب';
      if (infoLandmark) infoLandmark.textContent = `الموقع في ${store.location || 'أبو غريب'}، معتمد لخدمة زبائن المنطقة.`;
      if (infoHours) infoHours.textContent = store.opening_hours || '9:00 ص - 11:00 م';
      if (infoPhone) infoPhone.textContent = store.phone || '0770...';
      if (infoWaBtn) infoWaBtn.href = waUrl;
      if (infoCallBtn) infoCallBtn.href = `tel:${store.phone || ''}`;
    },

    renderStorePageProducts: (prods) => {
      const grid = document.getElementById('store-page-products-grid');
      if (!grid) return;

      const store = state.activeStore || {};
      const phoneRaw = (store.whatsapp || store.phone || '9647701112233').replace(/\D/g, '');

      if (!prods || prods.length === 0) {
        grid.innerHTML = `
          <div class="col-span-full glass-card p-12 text-center text-slate-400 text-xs border border-slate-800">
            <span class="text-4xl block mb-2">📦</span>
            لا توجد أجهزة مطابقة في هذا المحل حالياً.
          </div>
        `;
        return;
      }

      grid.innerHTML = prods.map((p) => {
        const isAvail = p.availability === 'available';
        const img = p.image_url || 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600';
        const prodWaMsg = encodeURIComponent(`مرحباً ${store.name || ''}، أنا مهتم بطلب جهاز (${p.name}) المعروض في متجركم بسعر ${formatIQD(p.price)} عبر منصة Mobilya.`);
        return `
          <div class="glass-card p-4 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3 group">
            <div class="relative bg-slate-900 rounded-xl p-3 aspect-square flex items-center justify-center overflow-hidden">
              <img src="${img}" alt="${p.name}" class="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
              <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${isAvail ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
                ${isAvail ? 'متوفر' : 'كمية محدودة'}
              </span>
            </div>
            <div>
              <span class="text-[10px] text-purple-400 font-bold block mb-0.5">${p.category_name || 'هواتف وأجهزة'}</span>
              <h4 class="font-bold text-xs text-white line-clamp-1 group-hover:text-purple-300 transition-colors">${p.name}</h4>
              <p class="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">${p.description || ''}</p>
            </div>
            <div class="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <span class="text-cyan-300 font-mono font-bold text-xs">${formatIQD(p.price)}</span>
              <a href="https://wa.me/${phoneRaw}?text=${prodWaMsg}" target="_blank" class="py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition-colors">
                <span>طلب واتساب</span>
                <span>💬</span>
              </a>
            </div>
          </div>
        `;
      }).join('');
    },

    filterStoreProducts: (term) => {
      if (!state.activeStore) return;
      const allProds = state.activeStore.products || [];
      if (!term || !term.trim()) {
        window.MobilyaApp.renderStorePageProducts(allProds);
        return;
      }
      const q = term.trim().toLowerCase();
      const filtered = allProds.filter((p) => {
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category_name && p.category_name.toLowerCase().includes(q))
        );
      });
      window.MobilyaApp.renderStorePageProducts(filtered);
    },

    closeStoreDetails: () => {
      const modal = document.getElementById('store-details-modal');
      if (modal) modal.classList.add('hidden');
      document.body.style.overflow = '';
    },

    setReviewRating: (val) => {
      val = parseInt(val, 10) || 5;
      const input = document.getElementById('review-rating-val');
      if (input) input.value = val;

      const labels = {
        1: 'ضعيف (نجمة واحدة)',
        2: 'مقبول (نجمتان)',
        3: 'جيد (3 نجوم)',
        4: 'جيد جداً (4 نجوم)',
        5: 'ممتاز (5 نجوم)',
      };
      const textEl = document.getElementById('selected-rating-text');
      if (textEl) textEl.textContent = labels[val] || 'ممتاز (5 نجوم)';

      const buttons = document.querySelectorAll('#star-picker-container .star-btn');
      buttons.forEach((btn) => {
        const starVal = parseInt(btn.getAttribute('data-val'), 10);
        if (starVal <= val) {
          btn.classList.add('text-amber-400');
          btn.classList.remove('text-slate-600');
        } else {
          btn.classList.remove('text-amber-400');
          btn.classList.add('text-slate-600');
        }
      });
    },

    focusReviewForm: () => {
      const container = document.getElementById('review-form-container');
      const textarea = document.getElementById('review-comment-text');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        container.classList.add('ring-2', 'ring-amber-400');
        setTimeout(() => container.classList.remove('ring-2', 'ring-amber-400'), 2000);
      }
      if (textarea) {
        setTimeout(() => textarea.focus(), 400);
      }
    },

    renderStoreReviews: async (store) => {
      if (!store || !store.id) return;

      let reviewsData = null;
      try {
        if (window.API) {
          reviewsData = await window.API.getStoreReviews(store.id);
        }
      } catch (err) {
        console.warn('Could not fetch reviews from API:', err);
      }

      const reviews = (reviewsData && reviewsData.reviews) ? reviewsData.reviews : (store.reviews || []);
      const count = (reviewsData && reviewsData.reviews_count !== undefined) ? reviewsData.reviews_count : reviews.length;
      const avg = (reviewsData && reviewsData.avg_rating !== undefined)
        ? Number(reviewsData.avg_rating).toFixed(1)
        : (store.avg_rating ? Number(store.avg_rating).toFixed(1) : '5.0');

      const breakdown = (reviewsData && reviewsData.breakdown) || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      if (!reviewsData || !reviewsData.breakdown) {
        reviews.forEach((r) => {
          const star = parseInt(r.rating, 10);
          if (breakdown[star] !== undefined) breakdown[star]++;
        });
      }

      // Update KPI
      const kpiRating = document.getElementById('store-kpi-rating');
      const kpiReviewsCount = document.getElementById('store-kpi-reviews-count');
      const navReviews = document.getElementById('store-nav-reviews-count');
      if (kpiRating) kpiRating.textContent = avg;
      if (kpiReviewsCount) kpiReviewsCount.textContent = `(${count} تقييم)`;
      if (navReviews) navReviews.textContent = count;

      // Update Score Card
      const avgEl = document.getElementById('store-detail-avg-rating');
      const starsVisualEl = document.getElementById('store-detail-stars-visual');
      const totalReviewsEl = document.getElementById('store-detail-total-reviews');
      const reviewsBadge = document.getElementById('store-reviews-counter-badge');

      if (avgEl) avgEl.textContent = avg;
      if (totalReviewsEl) totalReviewsEl.textContent = `بناءً على ${count} تقييم من زبائن قضاء أبو غريب`;
      if (reviewsBadge) reviewsBadge.textContent = `${count} تقييم`;

      // Generate stars string
      const fullStars = Math.round(Number(avg));
      let starsStr = '';
      for (let i = 1; i <= 5; i++) {
        starsStr += i <= fullStars ? '★' : '☆';
      }
      if (starsVisualEl) starsVisualEl.textContent = starsStr;

      // Progress bars
      for (let star = 1; star <= 5; star++) {
        const barEl = document.getElementById(`rating-bar-${star}`);
        const countEl = document.getElementById(`rating-count-${star}`);
        const starCnt = breakdown[star] || 0;
        const pct = count > 0 ? Math.round((starCnt / count) * 100) : 0;
        if (barEl) barEl.style.width = `${pct}%`;
        if (countEl) countEl.textContent = starCnt;
      }

      // Render Reviews List
      const listEl = document.getElementById('store-page-reviews-list');
      if (!listEl) return;

      if (reviews.length === 0) {
        listEl.innerHTML = `
          <div class="glass-card p-10 rounded-2xl text-center text-slate-400 text-xs border border-slate-800 space-y-2">
            <span class="text-3xl block">💬</span>
            <h4 class="font-bold text-white text-sm">كن أول من يقيّم هذا المحل!</h4>
            <p class="text-slate-400 text-xs max-w-md mx-auto">
              شارك تجربتك مع هذا المتجر لمساعدة أهالي أبو غريب وأبو منيصير في معرفة مستوى الخدمة والأسعار.
            </p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = reviews.map((r) => {
        const starNum = parseInt(r.rating, 10) || 5;
        let starIcons = '';
        for (let s = 1; s <= 5; s++) {
          starIcons += s <= starNum ? '<span class="text-amber-400">★</span>' : '<span class="text-slate-600">★</span>';
        }

        let timeStr = 'حديثاً';
        if (r.created_at) {
          try {
            const d = new Date(r.created_at);
            timeStr = d.toLocaleDateString('ar-IQ', { month: 'short', day: 'numeric', year: 'numeric' });
          } catch {
            timeStr = 'قبل قليل';
          }
        }

        return `
          <div class="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 space-y-3 transition-all">
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/30 text-white font-bold flex items-center justify-center text-sm">
                  ${(r.customer_name || 'ز').charAt(0)}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4 class="font-bold text-sm text-white">${r.customer_name || 'زبون من أبو غريب'}</h4>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold">زبون موثق ✓</span>
                  </div>
                  <span class="text-[10px] text-slate-500 block mt-0.5">📍 قضاء أبو غريب — ${timeStr}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 text-sm bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800">
                ${starIcons}
              </div>
            </div>
            ${r.comment ? `<p class="text-xs text-slate-300 leading-relaxed pr-1 pt-1">${r.comment}</p>` : ''}
          </div>
        `;
      }).join('');
    },

    submitStoreReview: async () => {
      if (!state.activeStore) return;
      const storeId = state.activeStore.id;

      const ratingVal = parseInt(document.getElementById('review-rating-val')?.value, 10) || 5;
      const nameInput = document.getElementById('review-customer-name');
      const commentInput = document.getElementById('review-comment-text');
      const submitBtn = document.getElementById('btn-submit-review');

      const customerName = nameInput ? nameInput.value.trim() : '';
      const comment = commentInput ? commentInput.value.trim() : '';

      if (!comment) {
        alert('يرجى كتابة رأيك وتفاصيل تجربتك مع المحل قبل الإرسال.');
        if (commentInput) commentInput.focus();
        return;
      }

      const prevBtnHtml = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>جاري إرسال التقييم...</span>';
      }

      try {
        if (window.API) {
          const res = await window.API.addStoreReview(storeId, {
            rating: ratingVal,
            comment,
            customer_name: customerName,
          });

          // Refresh store and reviews
          if (commentInput) commentInput.value = '';
          window.MobilyaApp.setReviewRating(5);

          // Update activeStore stats
          if (res && res.avg_rating) {
            state.activeStore.avg_rating = res.avg_rating;
            state.activeStore.reviews_count = res.reviews_count;
          }

          await window.MobilyaApp.renderStoreReviews(state.activeStore);

          // Also update the store in state.stores array so homepage reflects it
          const storeIdx = state.stores.findIndex((s) => s.id === storeId);
          if (storeIdx !== -1 && res) {
            state.stores[storeIdx].avg_rating = res.avg_rating;
            state.stores[storeIdx].reviews_count = res.reviews_count;
          }

          alert('🌟 شكراً لمشاركتك! تم إضافة تقييمك للمحل بنجاح.');
        }
      } catch (err) {
        console.error('Error submitting review:', err);
        alert('حدث خطأ أثناء إرسال التقييم: ' + (err.message || 'يرجى المحاولة مجدداً'));
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = prevBtnHtml;
        }
      }
    },
  };

  document.addEventListener('DOMContentLoaded', initApp);
})();

