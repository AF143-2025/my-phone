/**
 * Mobilya Platform - Client-Side API Layer
 * يربط الواجهة بالخادم وقاعدة بيانات PostgreSQL
 */

const API_BASE = '/api';

const API = {
  // --- Token & User State Management ---
  getToken: () => localStorage.getItem('mobilya_token'),
  setToken: (token) => localStorage.setItem('mobilya_token', token),
  removeToken: () => localStorage.removeItem('mobilya_token'),

  getUser: () => {
    try {
      const u = localStorage.getItem('mobilya_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem('mobilya_user', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('mobilya_user'),

  isLoggedIn: () => !!API.getToken(),

  // Generic fetch wrapper
  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    const token = API.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || `خطأ في الخادم (${res.status})`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  },

  // --- 1. Authentication ---
  async register(formData) {
    const data = await API.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    if (data.token) {
      API.setToken(data.token);
      API.setUser(data.user);
    }
    return data;
  },

  async login(email, password) {
    const data = await API.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      API.setToken(data.token);
      API.setUser(data.user);
    }
    return data;
  },

  async logout() {
    try {
      await API.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn(e);
    } finally {
      API.removeToken();
      API.removeUser();
    }
  },

  async getMe() {
    const data = await API.request('/auth/me');
    if (data.user) {
      API.setUser(data.user);
    }
    return data.user;
  },

  // --- 2. Categories ---
  async getCategories() {
    const data = await API.request('/categories');
    return data.categories || [];
  },

  // --- 3. Stores ---
  async getStores(params = {}) {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.location) qs.append('location', params.location);
    if (params.verified) qs.append('verified', params.verified);

    const data = await API.request(`/stores?${qs.toString()}`);
    return data.stores || [];
  },

  async getStoreById(id) {
    const data = await API.request(`/stores/${id}`);
    return data.store;
  },

  async createStore(storeData) {
    return await API.request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  },

  async updateStore(id, storeData) {
    return await API.request(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(storeData),
    });
  },

  async getStoreReviews(storeId) {
    return await API.request(`/stores/${storeId}/reviews`);
  },

  async addStoreReview(storeId, reviewData) {
    return await API.request(`/stores/${storeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  // --- 4. Products ---
  async getProducts(params = {}) {
    const qs = new URLSearchParams();
    if (params.search) qs.append('search', params.search);
    if (params.category_id) qs.append('category_id', params.category_id);
    if (params.store_id) qs.append('store_id', params.store_id);
    if (params.availability) qs.append('availability', params.availability);
    if (params.sort) qs.append('sort', params.sort);

    const data = await API.request(`/products?${qs.toString()}`);
    return data.products || [];
  },

  async getProductById(id) {
    const data = await API.request(`/products/${id}`);
    return data.product;
  },

  async createProduct(productData) {
    return await API.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  async updateProduct(id, productData) {
    return await API.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  async deleteProduct(id) {
    return await API.request(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // --- 5. Services ---
  async getServices(params = {}) {
    const qs = new URLSearchParams();
    if (params.store_id) qs.append('store_id', params.store_id);
    if (params.search) qs.append('search', params.search);

    const data = await API.request(`/services?${qs.toString()}`);
    return data.services || [];
  },

  async createService(serviceData) {
    return await API.request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  },

  // --- 6. Offers ---
  async getOffers() {
    const data = await API.request('/offers');
    return data.offers || [];
  },

  async createOffer(offerData) {
    return await API.request('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },

  // --- 7. Favorites ---
  async getFavorites() {
    if (!API.isLoggedIn()) return [];
    try {
      const data = await API.request('/favorites');
      return data.favorites || [];
    } catch {
      return [];
    }
  },

  async addFavorite(productId) {
    return await API.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },

  async removeFavorite(productId) {
    return await API.request(`/favorites/${productId}`, {
      method: 'DELETE',
    });
  },

  // --- 8. Admin APIs ---
  async getAdminDashboard() {
    return await API.request('/admin/dashboard');
  },

  async getAdminPendingStores() {
    const data = await API.request('/admin/stores/pending');
    return data.stores || [];
  },

  async approveStore(id) {
    return await API.request(`/admin/stores/${id}/approve`, {
      method: 'PUT',
    });
  },

  async rejectStore(id, reason = '') {
    return await API.request(`/admin/stores/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  async verifyStore(id) {
    return await API.request(`/admin/stores/${id}/verify`, {
      method: 'PUT',
    });
  },
};

window.API = API;
