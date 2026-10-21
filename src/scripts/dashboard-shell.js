// ============================================================
// ShopFlow — Mangos Aesthetic Dashboard Shell
// Matches the uploaded Mangos screenshot exact visual structure
// ============================================================
import { AuthStore, CartStore } from './store.js';

export function initDashboardShell(opts = {}) {
  const { activePage = 'dashboard', pageTitle = 'Dashboard' } = opts;

  const user = AuthStore.requireAuth();
  if (!user) return null;

  const isAdmin = user.role === 'admin';
  const cartCount = CartStore.getItemCount(user.id);

  // Mangos Sidebar Navigation
  const sidebarHtml = `
    <aside class="app-mangos-sidebar" id="app-mangos-sidebar">
      <!-- Logo: M MANGOS -->
      <a href="./index.html" class="mangos-brand">
        <div class="mangos-brand-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 19V5C4 3.89543 4.89543 3 6 3H7.5C8.05228 3 8.57728 3.22836 8.95528 3.63022L12 6.87022L15.0447 3.63022C15.4227 3.22836 15.9477 3 16.5 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19Z" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9 13H15" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="mangos-brand-title">SHOPFLOW</span>
      </a>

      <!-- Navigation list matching screenshot -->
      <nav class="mangos-nav-list">
        <!-- 1. Home / Dashboard -->
        <a href="./index.html" class="mangos-nav-item ${activePage === 'dashboard' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-house-door-fill"></i>
            <span>Home</span>
          </div>
        </a>

        <!-- 2. Quick Access / Store -->
        <a href="../store.html" class="mangos-nav-item">
          <div class="nav-left">
            <i class="bi bi-file-earmark-text"></i>
            <span>Quick Access</span>
          </div>
        </a>

        <!-- 3. Products -->
        <a href="./products.html" class="mangos-nav-item ${activePage === 'products' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-grid-fill"></i>
            <span>Products</span>
          </div>
          <i class="bi bi-plus text-muted"></i>
        </a>

        <!-- 4. Orders -->
        <a href="./orders.html" class="mangos-nav-item ${activePage === 'orders' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-check2-square"></i>
            <span>Orders</span>
          </div>
          <i class="bi bi-chevron-down text-muted" style="font-size: 0.7rem;"></i>
        </a>

        <!-- 5. QR labels / customer cart -->
        <a href="${isAdmin ? './qr-generator.html' : './cart.html'}" class="mangos-nav-item ${activePage === 'qr' || activePage === 'cart' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-briefcase-fill"></i>
            <span>${isAdmin ? 'Projects & QR' : 'My Cart'}</span>
          </div>
          ${cartCount > 0 ? `<span class="badge bg-primary rounded-pill small">${cartCount}</span>` : ''}
        </a>

        <!-- 6. Analytics -->
        <a href="./analytics.html" class="mangos-nav-item ${activePage === 'analytics' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-diagram-3-fill"></i>
            <span>Analytics</span>
          </div>
        </a>

        <!-- 7. Customers -->
        ${isAdmin ? `
          <a href="./users.html" class="mangos-nav-item ${activePage === 'users' ? 'active' : ''}">
            <div class="nav-left">
              <i class="bi bi-building"></i>
              <span>Customers</span>
            </div>
            <i class="bi bi-chevron-down text-muted" style="font-size: 0.7rem;"></i>
          </a>
        ` : ''}

        <!-- 8. Website CMS -->
        ${isAdmin ? `
          <a href="./cms.html" class="mangos-nav-item ${activePage === 'cms' ? 'active' : ''}">
            <div class="nav-left">
              <i class="bi bi-grid-3x3-gap-fill"></i>
              <span>Website CMS</span>
            </div>
          </a>
        ` : ''}

        <!-- 9. Settings -->
        <a href="./settings.html" class="mangos-nav-item ${activePage === 'settings' ? 'active' : ''}">
          <div class="nav-left">
            <i class="bi bi-file-bar-graph"></i>
            <span>Settings</span>
          </div>
          <i class="bi bi-plus text-muted"></i>
        </a>
      </nav>

      <!-- Blue Primary CTA Button matching screenshot -->
      <a href="${isAdmin ? './products.html' : './cart.html'}" class="mangos-btn-create">
        <i class="bi ${isAdmin ? 'bi-plus-lg' : 'bi-cart3'}"></i>
        <span>${isAdmin ? 'Add Product' : 'View Cart'}</span>
      </a>

      <!-- Help and Support at bottom -->
      <a href="#" onclick="alert('ShopFlow Support: support@shopflow.com | Hotline: +91 98765 43210')" class="mangos-bottom-help">
        <i class="bi bi-question-circle"></i>
        <span>Help and Support</span>
      </a>
    </aside>

    <div class="sidebar-overlay" id="sidebar-overlay" onclick="closeSidebar()"></div>
  `;

  // Mangos Header matching screenshot:
  // Title "Dashboard" | Search input | Check-in pill | Bell button | User avatar
  const headerHtml = `
    <header class="app-mangos-header">
      <div class="d-flex align-items-center gap-3">
        <button class="d-lg-none btn btn-light rounded-3 p-1" onclick="toggleSidebar()">
          <i class="bi bi-list fs-4"></i>
        </button>
        <h1 class="mangos-header-title mb-0">${pageTitle}</h1>
      </div>

      <div class="d-flex align-items-center gap-3 ms-auto">
        <!-- Inset Search Bar matching screenshot -->
        <div class="mangos-search-box d-none d-md-flex">
          <i class="bi bi-search"></i>
          <input type="search" placeholder="Search anything..." id="global-search-input">
        </div>

        <!-- Green Check-in button matching screenshot with live clock -->
        <button class="mangos-checkin-btn" id="checkin-btn" onclick="toggleCheckin()">
          <i class="bi bi-clock"></i>
          <span>Check-in <span id="live-checkin-time">12:03:40 pm</span></span>
        </button>

        <!-- Notification Bell matching screenshot -->
        <div class="dropdown">
          <div class="mangos-bell-btn" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-bell"></i>
            <span class="red-dot"></span>
          </div>
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-3 mt-2" style="width: 280px;">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="fw-bold small">Alerts</span>
              <span class="badge bg-danger-subtle text-danger small">2 New</span>
            </div>
            <div class="small p-2 bg-light rounded-3 mb-2">
              <div class="fw-bold text-dark">Order #103,000 processed</div>
              <div class="text-muted" style="font-size:.7rem;">Just now • Verified</div>
            </div>
            <div class="small p-2 bg-light rounded-3">
              <div class="fw-bold text-dark">QR Product Label scanned</div>
              <div class="text-muted" style="font-size:.7rem;">Smart Watch Pro • 12 mins ago</div>
            </div>
          </ul>
        </div>

        <!-- User Avatar with yellow ring matching screenshot -->
        <div class="dropdown">
          <img class="mangos-user-avatar" 
               src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" 
               alt="${user.name}" 
               data-bs-toggle="dropdown" 
               aria-expanded="false">
          <ul class="dropdown-menu dropdown-menu-end shadow border-0 rounded-4 p-2 mt-2" style="min-width: 220px;">
            <li class="px-3 py-2 border-bottom mb-1">
              <div class="fw-bold small text-dark">${user.name}</div>
              <div class="text-muted" style="font-size: .75rem;">${user.email} (${user.role})</div>
            </li>
            <li><a class="dropdown-item rounded-3 small py-2" href="./settings.html"><i class="bi bi-person me-2 text-primary"></i>My Profile</a></li>
            ${isAdmin ? `<li><a class="dropdown-item rounded-3 small py-2" href="./cms.html"><i class="bi bi-sliders me-2 text-success"></i>Website CMS Builder</a></li>` : ''}
            <li><a class="dropdown-item rounded-3 small py-2" href="./orders.html"><i class="bi bi-bag-check me-2 text-info"></i>Orders</a></li>
            <li><hr class="dropdown-divider my-1"></li>
            <li><button class="dropdown-item rounded-3 small py-2 text-danger" onclick="doLogout()"><i class="bi bi-box-arrow-left me-2"></i>Sign Out</button></li>
          </ul>
        </div>
      </div>
    </header>
  `;

  // Attach atmospheric body class
  document.body.classList.add('app-canvas-mode');

  // Keep the sidebar and page content in the same app layout container.
  const app = document.querySelector('.admin-app');
  if (!app) {
    throw new Error('Dashboard shell requires an .admin-app container.');
  }
  app.insertAdjacentHTML('afterbegin', sidebarHtml);

  // Replace header placeholder
  const placeholder = document.getElementById('admin-header-placeholder');
  if (placeholder) {
    const header = document.createRange().createContextualFragment(headerHtml);
    const main = placeholder.closest('.admin-app')?.querySelector('.admin-main');
    if (main) {
      placeholder.remove();
      main.prepend(header);
    } else {
      placeholder.replaceWith(header);
    }
  }

  // Live clock for check-in
  function updateClock() {
    const clockEl = document.getElementById('live-checkin-time');
    if (!clockEl) return;
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).toLowerCase();
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Sidebar toggle
  window.toggleSidebar = function() {
    document.getElementById('app-mangos-sidebar').classList.toggle('open');
    document.getElementById('sidebar-overlay').classList.toggle('show');
  };

  window.closeSidebar = function() {
    document.getElementById('app-mangos-sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('show');
  };

  window.doLogout = function() {
    AuthStore.logout();
  };

  window.toggleCheckin = function() {
    showToast('Check-in status: Logged & Active for store shift!', 'success');
  };

  return user;
}

export function formatINR(n) {
  if (n === undefined || n === null) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  }).format(new Date(dateStr));
}

export function showToast(message, type = 'success') {
  const colors = { success: '#23834b', error: '#c83f46', info: '#c58a1a', warning: '#c58a1a' };
  const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', info: 'bi-info-circle-fill', warning: 'bi-exclamation-triangle-fill' };

  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed;top:28px;right:28px;background:white;border-radius:14px;padding:14px 22px;box-shadow:0 12px 35px rgba(25,40,85,0.18);display:flex;align-items:center;gap:12px;z-index:99999;min-width:300px;transform:translateX(130%);transition:transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);border-left:5px solid ${colors[type]};`;
  const icon = document.createElement('i');
  icon.className = `bi ${icons[type]}`;
  icon.style.cssText = `color:${colors[type]};font-size:1.25rem`;
  const text = document.createElement('span');
  text.style.cssText = 'font-size:0.9rem;font-weight:700;color:#1e293b';
  text.textContent = message;
  toast.append(icon, text);
  document.body.appendChild(toast);
  setTimeout(() => toast.style.transform = 'translateX(0)', 40);
  setTimeout(() => { toast.style.transform = 'translateX(130%)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

const ORDER_STATUS_COLORS = {
  confirmed: { color: '#2868d6', background: '#e8f0ff' },
  processing: { color: '#a97521', background: '#fff2d9' },
  shipped: { color: '#6558bd', background: '#efedff' },
  delivered: { color: '#378454', background: '#e7f5eb' },
  cancelled: { color: '#b75252', background: '#fceaea' },
};

export function getStatusColor(status) {
  return ORDER_STATUS_COLORS[status]?.color || '#64748b';
}

export function getStatusBg(status) {
  return ORDER_STATUS_COLORS[status]?.background || '#f1f5f9';
}
