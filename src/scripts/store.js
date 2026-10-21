// ============================================================
// ShopFlow — Core Authentication & Data Management
// Handles: auth, users, products, orders, cart (localStorage)
// ============================================================

// ─── Default Admin & Seed Data ───────────────────────────────

const DEFAULT_ADMIN = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@shopflow.com',
  password: 'admin123',
  role: 'admin',
  avatar: null,
  createdAt: new Date('2024-01-01').toISOString(),
  totalSpent: 0,
};

const SEED_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Premium Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life. Perfect for professionals and audiophiles. Features advanced ANC technology and premium drivers for crystal-clear sound.',
    price: 2999,
    originalPrice: 3999,
    category: 'Electronics',
    brand: 'SoundPro',
    sku: 'SP-WH-001',
    stock: 45,
    weight: '250g',
    dimensions: '18 x 15 x 8 cm',
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    tags: ['wireless', 'audio', 'premium'],
    createdAt: new Date('2024-01-15').toISOString(),
    active: true,
  },
  {
    id: 'prod-002',
    name: 'Ergonomic Office Chair',
    description: 'Premium lumbar-support office chair with adjustable height, armrests, and breathable mesh back. Designed for all-day comfort in professional environments.',
    price: 12999,
    originalPrice: 15999,
    category: 'Furniture',
    brand: 'ComfortWork',
    sku: 'CW-EC-002',
    stock: 12,
    weight: '15kg',
    dimensions: '65 x 65 x 120 cm',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=300&fit=crop',
    tags: ['office', 'ergonomic', 'furniture'],
    createdAt: new Date('2024-01-20').toISOString(),
    active: true,
  },
  {
    id: 'prod-003',
    name: 'Smart Watch Pro X',
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery. Water-resistant up to 50m. Compatible with iOS and Android.',
    price: 8999,
    originalPrice: 10999,
    category: 'Electronics',
    brand: 'TechWear',
    sku: 'TW-SW-003',
    stock: 78,
    weight: '48g',
    dimensions: '4.4 x 3.8 x 1.1 cm',
    rating: 4.6,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    tags: ['wearable', 'fitness', 'smart'],
    createdAt: new Date('2024-02-01').toISOString(),
    active: true,
  },
  {
    id: 'prod-004',
    name: 'Professional Camera Lens 50mm',
    description: 'Prime 50mm f/1.4 lens with ultra-fast aperture for stunning portraits and low-light photography. Compatible with major DSLR and mirrorless mounts.',
    price: 24999,
    originalPrice: 28999,
    category: 'Photography',
    brand: 'OpticMaster',
    sku: 'OM-CL-004',
    stock: 8,
    weight: '320g',
    dimensions: '7.3 x 7.3 x 5.5 cm',
    rating: 4.9,
    reviews: 43,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    tags: ['photography', 'lens', 'professional'],
    createdAt: new Date('2024-02-10').toISOString(),
    active: true,
  },
  {
    id: 'prod-005',
    name: 'Organic Green Tea Collection',
    description: 'Premium selection of 12 organic green teas sourced from the finest estates in Japan and China. Rich in antioxidants and naturally soothing.',
    price: 899,
    originalPrice: 1199,
    category: 'Food & Beverages',
    brand: 'PureLeaf',
    sku: 'PL-GT-005',
    stock: 150,
    weight: '500g',
    dimensions: '20 x 15 x 8 cm',
    rating: 4.4,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    tags: ['organic', 'beverage', 'health'],
    createdAt: new Date('2024-02-15').toISOString(),
    active: true,
  },
  {
    id: 'prod-006',
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB mechanical gaming keyboard with Cherry MX switches, N-key rollover, and dedicated macro keys. Built for professional gamers and heavy typists.',
    price: 5499,
    originalPrice: 6999,
    category: 'Electronics',
    brand: 'GameGear',
    sku: 'GG-KB-006',
    stock: 35,
    weight: '1.1kg',
    dimensions: '44 x 14 x 3.5 cm',
    rating: 4.3,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    tags: ['gaming', 'keyboard', 'mechanical'],
    createdAt: new Date('2024-02-20').toISOString(),
    active: true,
  },
  {
    id: 'prod-007',
    name: 'Yoga Mat Premium',
    description: 'Eco-friendly non-slip yoga mat made from natural rubber. 6mm thick for joint protection. Includes carrying strap. Perfect for all yoga styles.',
    price: 1799,
    originalPrice: 2299,
    category: 'Sports & Fitness',
    brand: 'ZenFit',
    sku: 'ZF-YM-007',
    stock: 92,
    weight: '1.5kg',
    dimensions: '183 x 61 x 0.6 cm',
    rating: 4.8,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop',
    tags: ['yoga', 'fitness', 'wellness'],
    createdAt: new Date('2024-03-01').toISOString(),
    active: true,
  },
  {
    id: 'prod-008',
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated 750ml bottle keeps drinks cold 24hrs and hot 12hrs. BPA-free, leak-proof lid, wide mouth for easy cleaning.',
    price: 999,
    originalPrice: 1499,
    category: 'Sports & Fitness',
    brand: 'HydroLife',
    sku: 'HL-WB-008',
    stock: 200,
    weight: '300g',
    dimensions: '28 x 7.5 cm',
    rating: 4.6,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    tags: ['hydration', 'eco-friendly', 'sports'],
    createdAt: new Date('2024-03-05').toISOString(),
    active: true,
  },
];

const SEED_ORDERS = [
  {
    id: 'ORD-2024-001',
    userId: 'admin-001',
    items: [{ productId: 'prod-001', name: 'Premium Wireless Headphones', qty: 1, price: 2999 }],
    total: 2999,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 'ORD-2024-002',
    userId: 'admin-001',
    items: [
      { productId: 'prod-003', name: 'Smart Watch Pro X', qty: 1, price: 8999 },
      { productId: 'prod-008', name: 'Stainless Steel Water Bottle', qty: 2, price: 999 },
    ],
    total: 10997,
    status: 'processing',
    paymentMethod: 'UPI',
    createdAt: new Date('2024-03-20').toISOString(),
  },
];

// ─── Storage Keys ─────────────────────────────────────────────
const KEYS = {
  USERS: 'sf_users',
  PRODUCTS: 'sf_products',
  ORDERS: 'sf_orders',
  CART: 'sf_cart',
  CURRENT_USER: 'sf_current_user',
  CMS: 'sf_cms_content',
  INITIALIZED: 'sf_initialized',
};

// ─── Default CMS Content ──────────────────────────────────────
const DEFAULT_CMS = {
  branding: {
    storeName: 'ShopFlow',
    tagLine: 'Smart Retail Platform for Shop Owners',
    logoIcon: 'bi-bag-heart-fill',
    supportEmail: 'support@shopflow.com',
    supportPhone: '+91 98765 43210',
    currency: '₹',
    themeColor: '#245148',
  },
  announcement: {
    active: true,
    badge: 'NEW',
    text: 'Special Offer: Free QR Label Setup + Free Shipping on your first 100 orders! 🏷️',
    link: './store.html',
  },
  hero: {
    badge: 'Trusted by 2,400+ Retailers & Shop Owners',
    titleLine1: 'The Smarter Way to',
    highlight: 'Run Your Retail',
    titleLine2: 'Business',
    subtitle: 'ShopFlow gives you a powerful admin dashboard, QR-code product labels, real-time inventory tracking, and an online storefront — all in one beautifully simple platform.',
    ctaPrimaryText: 'Start Free Today',
    ctaPrimaryLink: './register.html',
    ctaSecondaryText: 'Explore Store',
    ctaSecondaryLink: './store.html',
    stat1Num: '2.4K+',
    stat1Label: 'Shop Owners',
    stat2Num: '₹48Cr+',
    stat2Label: 'Sales Tracked',
    stat3Num: '99.9%',
    stat3Label: 'Uptime',
    stat4Num: '4.9★',
    stat4Label: 'Rating',
  },
  features: {
    sectionBadge: 'Features',
    sectionTitle: 'Everything a Modern Retailer Needs',
    sectionSubtitle: 'From QR code labels to full inventory management — ShopFlow is built for serious shop owners.',
    items: [
      {
        id: 'feat-1',
        icon: 'bi-qr-code-scan',
        color: '#1d725f',
        title: 'Smart QR Product Labels',
        description: 'Generate unique QR codes for every product. Print branded labels — customers scan to get full product details instantly.',
      },
      {
        id: 'feat-2',
        icon: 'bi-speedometer2',
        color: '#22c55e',
        title: 'Real-Time Dashboard',
        description: 'Beautiful analytics with revenue charts, order tracking, inventory alerts, and customer spending insights — all live.',
      },
      {
        id: 'feat-3',
        icon: 'bi-shield-check',
        color: '#f59e0b',
        title: 'Role-Based Access',
        description: 'Admins control everything. Customers see their personalized shopping dashboard with cart, orders, and spending history.',
      },
      {
        id: 'feat-4',
        icon: 'bi-cart3',
        color: '#06b6d4',
        title: 'Smart Cart & Checkout',
        description: 'Customers can save items in cart, come back later, and check out when ready. Full order history with spending analytics.',
      },
      {
        id: 'feat-5',
        icon: 'bi-box-seam',
        color: '#8b5cf6',
        title: 'Inventory Management',
        description: 'Track stock levels, get low-stock alerts, manage categories, SKUs, weights, and dimensions from one clean interface.',
      },
      {
        id: 'feat-6',
        icon: 'bi-palette',
        color: '#ec4899',
        title: 'Admin CMS Builder',
        description: 'Live content management system. Easily customize store texts, banners, marketing headlines, and testimonials without code.',
      },
    ],
  },
  testimonials: {
    sectionBadge: 'Testimonials',
    sectionTitle: 'What Retailers Say',
    items: [
      {
        id: 'test-1',
        name: 'Rajesh Kumar',
        shop: 'Electronics Shop, Delhi',
        rating: 5,
        review: 'The QR code feature is a game-changer. My customers scan and instantly get all product details. Sales went up 40% in the first month!',
      },
      {
        id: 'test-2',
        name: 'Priya Mehta',
        shop: 'Clothing Boutique, Mumbai',
        rating: 5,
        review: 'The dashboard is stunning. Inventory tracking keeps me stress-free. The soft green neumorphic design is so calming and easy to use.',
      },
      {
        id: 'test-3',
        name: 'Amit Sharma',
        shop: 'SuperMart, Bengaluru',
        rating: 5,
        review: 'Setup took 10 minutes. The CMS allows me to change promotional banners in seconds. Best retail tool we have used.',
      },
    ],
  },
  cta: {
    badge: 'Ready to transform your retail?',
    title: 'Start Your Free Account Today',
    subtitle: 'Join thousands of retailers already using ShopFlow to manage their stores, generate QR labels, and grow revenue.',
    btnPrimaryText: 'Create Free Account',
    btnPrimaryLink: './register.html',
    btnSecondaryText: 'Browse as Guest',
    btnSecondaryLink: './store.html',
  },
  footer: {
    about: 'Professional e-commerce and retail management platform. Built for modern shop owners who demand simplicity, reliability, and power.',
    copyright: '© 2026 ShopFlow Technologies. Built with modern neumorphism for retailers.',
  },
  navigation: [
    { id: 'nav-store', label: 'Browse Store', href: './store.html', visible: true },
    { id: 'nav-signin', label: 'Sign In', href: './login.html', visible: true },
    { id: 'nav-primary', label: 'Get Started', href: './register.html', visible: true, primary: true },
  ],
  visibility: {
    announcement: true,
    hero: true,
    features: true,
    catalog: true,
    testimonials: true,
    cta: true,
    footer: true,
  },
  pages: [],
};

function mergeCmsData(defaults, saved) {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) {
    return saved === undefined ? defaults : saved;
  }
  const merged = { ...defaults };
  for (const [key, value] of Object.entries(saved)) {
    const fallback = defaults && typeof defaults === 'object' ? defaults[key] : undefined;
    merged[key] = value && typeof value === 'object' && !Array.isArray(value) && fallback && typeof fallback === 'object' && !Array.isArray(fallback)
      ? mergeCmsData(fallback, value)
      : value;
  }
  return merged;
}

// ─── Initialize Store ─────────────────────────────────────────
function initStore() {
  if (localStorage.getItem(KEYS.INITIALIZED)) return;

  localStorage.setItem(KEYS.USERS, JSON.stringify([DEFAULT_ADMIN]));
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(SEED_ORDERS));
  localStorage.setItem(KEYS.CART, JSON.stringify({}));
  localStorage.setItem(KEYS.CMS, JSON.stringify(DEFAULT_CMS));
  localStorage.setItem(KEYS.INITIALIZED, '1');
}

// ─── CMS Store ────────────────────────────────────────────────
export const CmsStore = {
  get: () => {
    try {
      const data = localStorage.getItem(KEYS.CMS);
      return data ? mergeCmsData(DEFAULT_CMS, JSON.parse(data)) : mergeCmsData(DEFAULT_CMS, {});
    } catch (error) {
      console.error('Unable to read saved CMS content.', error);
      return mergeCmsData(DEFAULT_CMS, {});
    }
  },
  save: (data) => {
    localStorage.setItem(KEYS.CMS, JSON.stringify(data));
  },
  updateSection: (sectionKey, sectionData) => {
    const current = CmsStore.get();
    current[sectionKey] = { ...current[sectionKey], ...sectionData };
    CmsStore.save(current);
    return current;
  },
  reset: () => {
    localStorage.setItem(KEYS.CMS, JSON.stringify(DEFAULT_CMS));
    return DEFAULT_CMS;
  },
};

// ─── User Store ───────────────────────────────────────────────
export const UserStore = {
  getAll: () => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  save: (users) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),

  findByEmail: (email) => UserStore.getAll().find((u) => u.email.toLowerCase() === email.toLowerCase()),

  register: (name, email, password) => {
    const users = UserStore.getAll();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'Email already registered' };
    }
    const user = {
      id: 'user-' + Date.now(),
      name,
      email,
      password,
      role: 'user',
      avatar: null,
      createdAt: new Date().toISOString(),
      totalSpent: 0,
    };
    users.push(user);
    UserStore.save(users);
    return { user };
  },

  update: (id, updates) => {
    const users = UserStore.getAll();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return false;
    users[idx] = { ...users[idx], ...updates };
    UserStore.save(users);
    // Update current user if it's the same
    const current = AuthStore.currentUser();
    if (current && current.id === id) {
      AuthStore.setCurrentUser(users[idx]);
    }
    return true;
  },

  delete: (id) => {
    const users = UserStore.getAll().filter((u) => u.id !== id);
    UserStore.save(users);
  },
};

// ─── Auth Store ───────────────────────────────────────────────
export const AuthStore = {
  currentUser: () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER) || 'null'),
  setCurrentUser: (user) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),

  login: (email, password) => {
    const user = UserStore.findByEmail(email);
    if (!user || user.password !== password) {
      return { error: 'Invalid email or password' };
    }
    const { password: _, ...safeUser } = user;
    AuthStore.setCurrentUser(safeUser);
    return { user: safeUser };
  },

  logout: () => {
    localStorage.removeItem(KEYS.CURRENT_USER);
    window.location.href = getBasePath() + 'login.html';
  },

  isAdmin: () => {
    const user = AuthStore.currentUser();
    return user && user.role === 'admin';
  },

  requireAuth: (redirectIfNoAuth = true) => {
    const user = AuthStore.currentUser();
    if (!user && redirectIfNoAuth) {
      window.location.href = getBasePath() + 'login.html';
      return null;
    }
    return user;
  },

  requireAdmin: () => {
    const user = AuthStore.requireAuth();
    if (user && user.role !== 'admin') {
      window.location.href = getBasePath() + 'dashboard/index.html';
      return null;
    }
    return user;
  },
};

// ─── Product Store ────────────────────────────────────────────
export const ProductStore = {
  getAll: () => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || '[]'),
  getActive: () => ProductStore.getAll().filter((p) => p.active),
  save: (products) => localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products)),

  findById: (id) => ProductStore.getAll().find((p) => p.id === id),

  create: (data) => {
    const products = ProductStore.getAll();
    const product = {
      id: 'prod-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      active: true,
      rating: 0,
      reviews: 0,
    };
    products.push(product);
    ProductStore.save(products);
    return product;
  },

  update: (id, updates) => {
    const products = ProductStore.getAll();
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    products[idx] = { ...products[idx], ...updates };
    ProductStore.save(products);
    return products[idx];
  },

  delete: (id) => {
    ProductStore.save(ProductStore.getAll().filter((p) => p.id !== id));
  },

  getCategories: () => {
    const cats = [...new Set(ProductStore.getAll().map((p) => p.category))];
    return cats.filter(Boolean);
  },

  getStats: () => {
    const products = ProductStore.getAll();
    return {
      total: products.length,
      active: products.filter((p) => p.active).length,
      lowStock: products.filter((p) => p.stock < 10).length,
      outOfStock: products.filter((p) => p.stock === 0).length,
      totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
    };
  },
};

// ─── Order Store ──────────────────────────────────────────────
export const OrderStore = {
  getAll: () => JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]'),
  save: (orders) => localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders)),

  findById: (id) => OrderStore.getAll().find((o) => o.id === id),

  getUserOrders: (userId) => OrderStore.getAll().filter((o) => o.userId === userId),

  create: (userId, items, paymentMethod = 'COD') => {
    const orders = OrderStore.getAll();
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = {
      id: 'ORD-' + Date.now(),
      userId,
      items,
      total,
      status: 'confirmed',
      paymentMethod,
      createdAt: new Date().toISOString(),
    };
    orders.push(order);
    OrderStore.save(orders);

    // Update user total spent
    const users = UserStore.getAll();
    const uIdx = users.findIndex((u) => u.id === userId);
    if (uIdx !== -1) {
      users[uIdx].totalSpent = (users[uIdx].totalSpent || 0) + total;
      UserStore.save(users);
    }

    return order;
  },

  updateStatus: (id, status) => {
    const orders = OrderStore.getAll();
    const idx = orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      orders[idx].status = status;
      OrderStore.save(orders);
    }
  },

  getStats: () => {
    const orders = OrderStore.getAll();
    return {
      total: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      confirmed: orders.filter((o) => o.status === 'confirmed').length,
      processing: orders.filter((o) => o.status === 'processing').length,
      delivered: orders.filter((o) => o.status === 'delivered').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  },
};

// ─── Cart Store ───────────────────────────────────────────────
export const CartStore = {
  getAll: () => JSON.parse(localStorage.getItem(KEYS.CART) || '{}'),
  save: (cart) => localStorage.setItem(KEYS.CART, JSON.stringify(cart)),

  getUserCart: (userId) => {
    const cart = CartStore.getAll();
    return cart[userId] || [];
  },

  addItem: (userId, productId, qty = 1) => {
    const cart = CartStore.getAll();
    if (!cart[userId]) cart[userId] = [];

    const existing = cart[userId].find((i) => i.productId === productId);
    const product = ProductStore.findById(productId);
    if (!product) return false;

    if (existing) {
      existing.qty = Math.min(existing.qty + qty, product.stock);
    } else {
      cart[userId].push({ productId, name: product.name, price: product.price, image: product.image, qty });
    }
    CartStore.save(cart);
    return true;
  },

  updateQty: (userId, productId, qty) => {
    const cart = CartStore.getAll();
    if (!cart[userId]) return;
    const item = cart[userId].find((i) => i.productId === productId);
    if (item) {
      if (qty <= 0) {
        cart[userId] = cart[userId].filter((i) => i.productId !== productId);
      } else {
        item.qty = qty;
      }
    }
    CartStore.save(cart);
  },

  removeItem: (userId, productId) => {
    const cart = CartStore.getAll();
    if (cart[userId]) {
      cart[userId] = cart[userId].filter((i) => i.productId !== productId);
      CartStore.save(cart);
    }
  },

  clearCart: (userId) => {
    const cart = CartStore.getAll();
    cart[userId] = [];
    CartStore.save(cart);
  },

  getItemCount: (userId) => {
    return CartStore.getUserCart(userId).reduce((sum, i) => sum + i.qty, 0);
  },

  getTotal: (userId) => {
    return CartStore.getUserCart(userId).reduce((sum, i) => sum + i.price * i.qty, 0);
  },
};

// ─── Helper: Base path detection ──────────────────────────────
export function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/dashboard/')) return '../';
  return './';
}

// ─── Format helpers ───────────────────────────────────────────
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

export function formatDatetime(dateStr) {
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(dateStr));
}

export function getStatusBadge(status) {
  const map = {
    confirmed: 'bg-primary',
    processing: 'bg-warning text-dark',
    shipped: 'bg-info text-dark',
    delivered: 'bg-success',
    cancelled: 'bg-danger',
  };
  return map[status] || 'bg-secondary';
}

// ─── Init on load ─────────────────────────────────────────────
initStore();
