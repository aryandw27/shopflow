import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, BarChart3, Bell, Box,
  Check, ChevronDown, CircleHelp, Clock3, Heart, LayoutDashboard, LockKeyhole,
  Menu, Package, Search, ShoppingBag, ShoppingCart, Sparkles, Star, Store,
  Truck, Users, X,
} from 'lucide-react';
import {
  AuthStore, CartStore, CmsStore, OrderStore, ProductStore, UserStore,
  formatCurrency, formatDate,
} from './scripts/store.js';
import {
  Badge, Button, Card, Dialog, Field, Input, Select, Textarea,
} from './components/ui.jsx';
import {
  AnalyticsPage, CartPage, CmsPage, DashboardPage, OrdersPage, ProductsPage,
  QrPage, SettingsPage, UsersPage,
} from './dashboard-pages.jsx';
import { ToastProvider, useToast } from './components/toast.jsx';

function safeHref(value) {
  const href = String(value || '').trim();
  if (!href) return '#';
  if (href.startsWith('#')) return href;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(href)) return href;
  if (/^(javascript:|data:|vbscript:)/i.test(href)) return '#';
  return `/${href.replace(/^\.\/+|^\/+/, '')}`;
}

function SmartLink({ href, className, children, ...props }) {
  const target = safeHref(href);
  if (/^(https?:\/\/|mailto:|tel:)/i.test(target)) {
    return <a className={className} href={target} rel={target.startsWith('http') ? 'noreferrer' : undefined} {...props}>{children}</a>;
  }
  return <Link className={className} to={target} {...props}>{children}</Link>;
}

function useRefresh() {
  const [, setVersion] = useState(0);
  return () => setVersion((version) => version + 1);
}

function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function PublicHeader({ cms, user }) {
  const navigate = useNavigate();
  const cartCount = user ? CartStore.getItemCount(user.id) : 0;
  const navigation = [
    ...(Array.isArray(cms.navigation) ? cms.navigation.filter((item) => item.visible !== false) : []),
    ...(Array.isArray(cms.pages) ? cms.pages
      .filter((page) => page.published && page.showInNav)
      .map((page) => ({
        id: `page-${page.id}`,
        label: page.title,
        href: `/content-page.html?slug=${encodeURIComponent(page.slug)}`,
      })) : []),
  ];
  return (
    <header className="public-header">
      {cms.visibility?.announcement !== false && cms.announcement?.active && (
        <div className="announcement">
          {cms.announcement.badge && <Badge tone="primary">{cms.announcement.badge}</Badge>}
          <span>{cms.announcement.text}</span>
          <SmartLink href={cms.announcement.link} aria-label="View offer"><ArrowRight size={15} /></SmartLink>
        </div>
      )}
      <div className="public-nav wrap">
        <SmartLink href="/index.html" className="brand"><span className="brand-icon"><Store size={19} /></span><span>{cms.branding?.storeName || 'ShopFlow'}</span></SmartLink>
        <nav className="public-nav-links">
          {navigation.map((item) => <SmartLink key={item.id} href={item.href} className={item.primary ? 'nav-cta' : ''}>{item.label}</SmartLink>)}
          <SmartLink href="/dashboard/cart.html" className="cart-link" aria-label="Shopping cart"><ShoppingCart size={18} />{cartCount > 0 && <span>{cartCount}</span>}</SmartLink>
          {user ? (
            <SmartLink href="/dashboard/index.html" className="nav-user">{user.name?.split(' ')[0]} <ChevronDown size={14} /></SmartLink>
          ) : <Button variant="outline" size="sm" onClick={() => navigate('/login.html')}>Sign in</Button>}
        </nav>
      </div>
    </header>
  );
}

function ProductCard({ product, onAdd }) {
  return (
    <Card className="product-card">
      <Link to={`/product-detail.html?id=${encodeURIComponent(product.id)}`} className="product-image">
        <img src={product.image || '/assets/images/product-placeholder.svg'} alt={product.name} loading="lazy" />
        {product.originalPrice > product.price && <Badge tone="success">Sale</Badge>}
        <button className="favorite-button" type="button" aria-label={`Save ${product.name}`} onClick={(event) => event.preventDefault()}><Heart size={17} /></button>
      </Link>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <Link to={`/product-detail.html?id=${encodeURIComponent(product.id)}`} className="product-name">{product.name}</Link>
        <div className="product-rating"><Star size={14} fill="currentColor" /> {product.rating || 'New'} <span>({product.reviews || 0})</span></div>
        <div className="product-card-bottom">
          <div><strong>{formatCurrency(product.price)}</strong>{product.originalPrice > product.price && <del>{formatCurrency(product.originalPrice)}</del>}</div>
          <Button size="icon" aria-label={`Add ${product.name} to cart`} onClick={() => onAdd(product)}><ShoppingCart size={17} /></Button>
        </div>
      </div>
    </Card>
  );
}

function LandingPage({ user, onRefresh }) {
  const cms = CmsStore.get();
  const products = ProductStore.getActive().slice(0, 4);
  const notify = useToast();
  const navigate = useNavigate();
  const onAdd = (product) => {
    if (!user) {
      notify('Sign in to add items to your cart.', 'warning');
      navigate('/login.html');
      return;
    }
    CartStore.addItem(user.id, product.id);
    onRefresh();
    notify('Added to your cart.');
  };
  const visibility = cms.visibility || {};
  return (
    <div className="public-page">
      <PublicHeader cms={cms} user={user} />
      <main>
        {visibility.hero !== false && (
          <section className="hero-section">
            <div className="hero-glow" />
            <div className="wrap hero-layout">
              <div className="hero-copy">
                <div className="hero-badge"><Sparkles size={15} />{cms.hero?.badge}</div>
                <h1>{cms.hero?.titleLine1}<br /><span>{cms.hero?.highlight}</span><br />{cms.hero?.titleLine2}</h1>
                <p>{cms.hero?.subtitle}</p>
                <div className="hero-actions">
                  <SmartLink className="ui-button ui-button-primary" href={cms.hero?.ctaPrimaryLink}>{cms.hero?.ctaPrimaryText}<ArrowRight size={17} /></SmartLink>
                  <SmartLink className="ui-button ui-button-outline" href={cms.hero?.ctaSecondaryLink}>{cms.hero?.ctaSecondaryText}</SmartLink>
                </div>
                <div className="hero-proof"><div className="avatar-stack"><span>R</span><span>P</span><span>A</span><span>+</span></div><div><strong>Trusted by retailers</strong><small>Built to make everyday commerce simpler</small></div></div>
              </div>
              <div className="hero-visual">
                <div className="hero-art-card">
                  <div className="hero-art-head"><span className="live-dot" /> Store overview <span className="period-pill">Last 30 days</span></div>
                  <div className="hero-revenue"><small>Total revenue</small><strong>₹4,82,450</strong><span className="growth"><ArrowUpRight size={14} /> 18.6%</span></div>
                  <div className="mini-chart" aria-label="Revenue trend chart">{[34, 49, 42, 62, 52, 74, 57, 88, 69, 96, 78, 100].map((height, i) => <span key={i} style={{ height: `${height}%` }} />)}</div>
                  <div className="art-footer"><span><Package size={15} /> Orders processed</span><b>1,248</b><span className="growth">+12.4%</span></div>
                </div>
                <div className="floating-card floating-order"><span className="floating-icon"><BadgeCheck size={19} /></span><span><b>Order completed</b><small>#SF-2084 · just now</small></span></div>
                <div className="floating-card floating-stock"><span className="stock-dot" /><span><b>Stock looking good</b><small>All categories in sync</small></span></div>
              </div>
            </div>
            <div className="wrap hero-stats">
              {[['2.4K+', 'Shop owners'], ['₹48Cr+', 'Sales tracked'], ['99.9%', 'Platform uptime'], ['4.9/5', 'Average rating']].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          </section>
        )}
        {visibility.features !== false && (
          <section className="section wrap">
            <div className="section-heading"><Badge tone="primary">Built for retail</Badge><h2>{cms.features?.sectionTitle}</h2><p>{cms.features?.sectionSubtitle}</p></div>
            <div className="feature-grid">
              {(cms.features?.items || []).map((item, index) => {
                const icons = [Package, BarChart3, LockKeyhole, ShoppingBag, Box, Sparkles];
                const Icon = icons[index % icons.length];
                return <Card className="feature-card" key={item.id || item.title}><div className="feature-icon"><Icon size={21} /></div><h3>{item.title}</h3><p>{item.description}</p><span className="feature-arrow"><ArrowUpRight size={17} /></span></Card>;
              })}
            </div>
          </section>
        )}
        {visibility.catalog !== false && (
          <section className="section catalog-section">
            <div className="wrap">
              <div className="section-heading section-heading-row"><div><Badge tone="primary">Curated collection</Badge><h2>Explore our store</h2><p>Thoughtful essentials picked for work, life, and everything in between.</p></div><SmartLink href="/store.html" className="text-link">View all products <ArrowRight size={16} /></SmartLink></div>
              <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>
            </div>
          </section>
        )}
        {visibility.testimonials !== false && (
          <section className="section wrap testimonial-section">
            <div className="section-heading"><Badge tone="primary">{cms.testimonials?.sectionBadge || 'Customer stories'}</Badge><h2>{cms.testimonials?.sectionTitle}</h2></div>
            <div className="testimonial-grid">{(cms.testimonials?.items || []).map((item) => <Card className="testimonial-card" key={item.id || item.name}><div className="stars">★★★★★</div><p>“{item.review}”</p><div className="testimonial-author"><span>{item.name?.[0] || 'S'}</span><div><b>{item.name}</b><small>{item.shop}</small></div></div></Card>)}</div>
          </section>
        )}
        {visibility.cta !== false && <section className="wrap cta-section"><div><Badge tone="on-dark">{cms.cta?.badge}</Badge><h2>{cms.cta?.title}</h2><p>{cms.cta?.subtitle}</p><div className="hero-actions"><SmartLink href={cms.cta?.btnPrimaryLink} className="ui-button ui-button-white">{cms.cta?.btnPrimaryText}<ArrowRight size={17} /></SmartLink><SmartLink href={cms.cta?.btnSecondaryLink} className="ui-button ui-button-dark-outline">{cms.cta?.btnSecondaryText}</SmartLink></div></div><div className="cta-orbit"><Store size={48} /></div></section>}
      </main>
      {visibility.footer !== false && <PublicFooter cms={cms} />}
    </div>
  );
}

function PublicFooter({ cms }) {
  return <footer className="public-footer"><div className="wrap footer-layout"><div><SmartLink href="/index.html" className="brand"><span className="brand-icon"><Store size={18} /></span>{cms.branding?.storeName || 'ShopFlow'}</SmartLink><p>{cms.footer?.about}</p></div><div className="footer-contact"><b>Need a hand?</b><a href={`mailto:${cms.branding?.supportEmail}`}>{cms.branding?.supportEmail}</a><a href={`tel:${cms.branding?.supportPhone}`}>{cms.branding?.supportPhone}</a></div><div className="footer-bottom">{cms.footer?.copyright}</div></div></footer>;
}

function StorePage({ user, onRefresh }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All categories');
  const [sort, setSort] = useState('featured');
  const notify = useToast();
  const navigate = useNavigate();
  const products = ProductStore.getActive();
  const categories = ['All categories', ...ProductStore.getCategories()];
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((p) => (category === 'All categories' || p.category === category) && (!term || `${p.name} ${p.category} ${p.brand || ''} ${p.description || ''}`.toLowerCase().includes(term)));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [products, query, category, sort]);
  const onAdd = (product) => {
    if (!user) return navigate('/login.html');
    CartStore.addItem(user.id, product.id);
    onRefresh();
    notify('Added to your cart.');
  };
  const cms = CmsStore.get();
  return <div className="public-page"><PublicHeader cms={cms} user={user} /><main className="wrap store-page"><div className="store-intro"><div><div className="eyebrow">SHOP THE COLLECTION</div><h1>Find your next favorite.</h1><p>Useful, well-made pieces for your everyday.</p></div><div className="store-search"><Search size={17} /><Input aria-label="Search products" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} /></div></div><div className="store-toolbar"><span>{filtered.length} products</span><div className="filter-controls"><Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</Select><Select aria-label="Sort products" value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option></Select></div></div>{filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div> : <Card className="empty-state"><Search size={28} /><h3>No products found</h3><p>Try changing your search or category filters.</p></Card>}</main><PublicFooter cms={cms} /></div>;
}

function ProductDetailPage({ user, onRefresh }) {
  const params = new URLSearchParams(useLocation().search);
  const product = ProductStore.findById(params.get('id'));
  const navigate = useNavigate();
  const notify = useToast();
  if (!product) return <MissingPage title="Product not found" />;
  const addToCart = () => {
    if (!user) return navigate('/login.html');
    if (!CartStore.addItem(user.id, product.id)) return notify('This product is no longer available.', 'error');
    onRefresh();
    notify('Added to your cart.');
  };
  return <div className="public-page"><PublicHeader cms={CmsStore.get()} user={user} /><main className="wrap detail-page"><div className="breadcrumbs"><SmartLink href="/store.html">Store</SmartLink><span>/</span><span>{product.category}</span><span>/</span><b>{product.name}</b></div><div className="detail-layout"><div className="detail-image"><img src={product.image || '/assets/images/product-placeholder.svg'} alt={product.name} /></div><div className="detail-copy"><Badge tone="primary">{product.category}</Badge><h1>{product.name}</h1><div className="product-rating"><Star size={16} fill="currentColor" /> {product.rating || 'New'} <span>({product.reviews || 0} reviews)</span></div><div className="detail-price"><strong>{formatCurrency(product.price)}</strong>{product.originalPrice > product.price && <del>{formatCurrency(product.originalPrice)}</del>}</div><p>{product.description}</p><div className="stock-note"><span className="live-dot" />{product.stock > 0 ? `${product.stock} available` : 'Currently out of stock'}</div><Button disabled={product.stock <= 0} onClick={addToCart}><ShoppingCart size={17} /> Add to cart</Button><div className="detail-perks"><span><Truck size={17} /> Reliable delivery</span><span><BadgeCheck size={17} /> Quality checked</span></div></div></div></main><PublicFooter cms={CmsStore.get()} /></div>;
}

function AuthPage({ mode, onLogin }) {
  const isRegister = mode === 'register';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notify = useToast();
  const cms = CmsStore.get();
  const submit = (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    const values = new FormData(event.currentTarget);
    if (isRegister) {
      const result = UserStore.register(String(values.get('name')).trim(), String(values.get('email')).trim(), String(values.get('password')));
      if (result.error) {
        setError(result.error);
        setBusy(false);
        return;
      }
      const loginResult = AuthStore.login(result.user.email, String(values.get('password')));
      if (loginResult.error) {
        setError(loginResult.error);
        setBusy(false);
        return;
      }
      onLogin(loginResult.user);
      notify('Your account is ready.');
      navigate('/dashboard/index.html');
      return;
    }
    const result = AuthStore.login(String(values.get('email')).trim(), String(values.get('password')));
    if (result.error) {
      setError(result.error);
      setBusy(false);
      return;
    }
    onLogin(result.user);
    notify(`Welcome back, ${result.user.name}.`);
    navigate(location.state?.from?.pathname || '/dashboard/index.html', { replace: true });
  };
  return <div className="auth-page"><div className="auth-art"><SmartLink href="/index.html" className="brand"><span className="brand-icon"><Store size={19} /></span>{cms.branding?.storeName || 'ShopFlow'}</SmartLink><div className="auth-art-content"><Badge tone="on-dark"><Sparkles size={14} /> RETAIL, IN SYNC</Badge><h1>Everything your store needs, in one place.</h1><p>Inventory, orders and the customer experience — connected with clarity.</p><div className="auth-art-stats"><div><b>2,400+</b><small>retailers growing</small></div><div><b>99.9%</b><small>reliable uptime</small></div></div></div><div className="auth-art-foot">A clearer view of your business, every day.</div></div><div className="auth-panel"><div className="auth-mobile-brand"><SmartLink href="/index.html" className="brand"><span className="brand-icon"><Store size={18} /></span>{cms.branding?.storeName || 'ShopFlow'}</SmartLink></div><Card className="auth-card"><div className="auth-card-icon"><LockKeyhole size={21} /></div><div className="eyebrow">{isRegister ? 'GET STARTED' : 'WELCOME BACK'}</div><h2>{isRegister ? 'Create your account' : 'Sign in to ShopFlow'}</h2><p>{isRegister ? 'Set up your account and start shopping.' : 'Enter your details to continue to your workspace.'}</p>{error && <div className="inline-alert alert-error" role="alert">{error}</div>}<form onSubmit={submit} className="stack-form">{isRegister && <Field label="Your name" htmlFor="name"><Input id="name" name="name" placeholder="Alex Morgan" autoComplete="name" required minLength={2} /></Field>}<Field label="Email address" htmlFor="email"><Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required /></Field><Field label="Password" htmlFor="password"><Input id="password" name="password" type="password" placeholder="At least 6 characters" autoComplete={isRegister ? 'new-password' : 'current-password'} required minLength={6} /></Field><Button type="submit" disabled={busy}>{isRegister ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></Button></form>{!isRegister && <div className="demo-credentials"><b>Demo admin access</b><span>admin@shopflow.com <i>·</i> admin123</span></div>}<div className="auth-switch">{isRegister ? 'Already have an account?' : 'New to ShopFlow?'} <SmartLink href={isRegister ? '/login.html' : '/register.html'}>{isRegister ? 'Sign in' : 'Create an account'}</SmartLink></div></Card><div className="auth-back"><SmartLink href="/index.html">← Back to homepage</SmartLink><span>© ShopFlow</span></div></div></div>;
}

function CustomContentPage({ user }) {
  const params = new URLSearchParams(useLocation().search);
  const slug = params.get('slug') || window.location.pathname.split('/').pop();
  const cms = CmsStore.get();
  const page = (cms.pages || []).find((item) => item.slug === slug && item.published);
  if (!page) return <MissingPage title="Page unavailable" />;
  return <div className="public-page"><PublicHeader cms={cms} user={user} /><main className="wrap custom-page"><div className="eyebrow">{cms.branding?.storeName || 'ShopFlow'}</div><h1>{page.title}</h1>{(page.sections || []).map((section) => <section className="custom-section" key={section.id}><h2>{section.title}</h2>{section.type === 'image' && safeHref(section.imageUrl) !== '#' && <img src={safeHref(section.imageUrl)} alt={section.title || ''} />}{section.body && <p>{section.body}</p>}{section.type === 'cta' && section.buttonText && <SmartLink className="ui-button ui-button-primary" href={section.buttonHref}>{section.buttonText}<ArrowRight size={16} /></SmartLink>}</section>)}</main><PublicFooter cms={cms} /></div>;
}

function DashboardShell({ user, page, title, children, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { to: '/dashboard/index.html', label: 'Overview', icon: LayoutDashboard, key: 'dashboard' },
    { to: '/store.html', label: 'Quick access', icon: Store, key: 'store' },
    { to: '/dashboard/products.html', label: 'Products', icon: Package, key: 'products', admin: true },
    { to: '/dashboard/orders.html', label: 'Orders', icon: ShoppingBag, key: 'orders' },
    { to: user.role === 'admin' ? '/dashboard/qr-generator.html' : '/dashboard/cart.html', label: user.role === 'admin' ? 'QR labels' : 'My cart', icon: user.role === 'admin' ? BadgeCheck : ShoppingCart, key: user.role === 'admin' ? 'qr' : 'cart' },
    { to: '/dashboard/analytics.html', label: 'Analytics', icon: BarChart3, key: 'analytics' },
    { to: '/dashboard/users.html', label: 'Customers', icon: Users, key: 'users', admin: true },
    { to: '/dashboard/cms.html', label: 'Website CMS', icon: Sparkles, key: 'cms', admin: true },
    { to: '/dashboard/settings.html', label: 'Settings', icon: LockKeyhole, key: 'settings' },
  ].filter((link) => !link.admin || user.role === 'admin');
  return <div className="dashboard-app">
    {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
    <aside className={`dashboard-sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <SmartLink href="/index.html" className="brand dashboard-brand"><span className="brand-icon"><Store size={19} /></span><span>SHOPFLOW</span></SmartLink>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>{links.map(({ to, label, icon: Icon, key }) => <Link className={`sidebar-link ${page === key ? 'active' : ''}`} to={to} key={key} onClick={() => setMenuOpen(false)}><Icon size={18} /><span>{label}</span>{key === 'cart' && CartStore.getItemCount(user.id) > 0 && <Badge tone="primary">{CartStore.getItemCount(user.id)}</Badge>}</Link>)}</nav>
      <div className="sidebar-spacer" />
      <Card className="sidebar-help"><div className="help-icon"><CircleHelp size={16} /></div><b>Need a hand?</b><span>Our support team is here to help.</span><a href={`mailto:${CmsStore.get().branding.supportEmail}`}>Contact support <ArrowRight size={13} /></a></Card>
      <div className="sidebar-profile"><div className="profile-avatar">{user.name?.[0]?.toUpperCase() || 'S'}</div><div className="profile-info"><b>{user.name}</b><span>{user.role === 'admin' ? 'Administrator' : 'Customer'}</span></div><button className="icon-button" aria-label="Sign out" onClick={onLogout}><ArrowDownRight size={17} /></button></div>
    </aside>
    <div className="dashboard-main">
      <header className="dashboard-topbar"><button className="icon-button mobile-menu" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="topbar-breadcrumb"><span>Workspace</span><span>/</span><b>{title}</b></div><div className="topbar-actions"><label className="topbar-search"><Search size={16} /><Input aria-label="Search" placeholder="Search anything..." /></label><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><button className="topbar-user" onClick={() => window.location.assign('/dashboard/settings.html')}><span className="profile-avatar">{user.name?.[0]?.toUpperCase() || 'S'}</span><span><b>{user.name}</b><small>{user.role === 'admin' ? 'Admin' : 'Customer'}</small></span><ChevronDown size={14} /></button></div></header>
      <main className="dashboard-content">{children}</main>
    </div>
  </div>;
}

function MissingPage({ title = 'Page not found' }) {
  return <main className="missing-page"><div className="missing-mark">404</div><h1>{title}</h1><p>The page may have moved, or the link is no longer available.</p><SmartLink href="/index.html" className="ui-button ui-button-primary">Back to ShopFlow <ArrowRight size={16} /></SmartLink></main>;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => AuthStore.currentUser());
  const refresh = useRefresh();
  const pathname = location.pathname.toLowerCase();
  const basename = pathname.split('/').pop();
  const adminPages = {
    'index.html': ['dashboard', 'Overview', DashboardPage],
    'products.html': ['products', 'Products', ProductsPage],
    'orders.html': ['orders', 'Orders', OrdersPage],
    'cart.html': ['cart', 'My cart', CartPage],
    'users.html': ['users', 'Customers', UsersPage],
    'analytics.html': ['analytics', 'Analytics', AnalyticsPage],
    'qr-generator.html': ['qr', 'QR labels', QrPage],
    'settings.html': ['settings', 'Settings', SettingsPage],
    'cms.html': ['cms', 'Website CMS', CmsPage],
  };
  useEffect(() => {
    const current = AuthStore.currentUser();
    setUser(current);
    const titles = { 'store.html': 'Store', 'login.html': 'Sign in', 'register.html': 'Create account' };
    document.title = `${titles[basename] || adminPages[basename]?.[1] || 'ShopFlow'} — ShopFlow`;
  }, [pathname, location.search]);

  let content;
  if (pathname === '/' || basename === 'index.html' && !pathname.includes('/dashboard/') || basename === 'landing.html') {
    content = <LandingPage user={user} onRefresh={refresh} />;
  } else if (basename === 'store.html') {
    content = <StorePage user={user} onRefresh={refresh} />;
  } else if (basename === 'product-detail.html') {
    content = <ProductDetailPage user={user} onRefresh={refresh} />;
  } else if (basename === 'login.html' || pathname === '/login') {
    content = <AuthPage mode="login" onLogin={setUser} />;
  } else if (basename === 'register.html' || pathname === '/register') {
    content = <AuthPage mode="register" onLogin={setUser} />;
  } else if (basename === 'content-page.html' || pathname.startsWith('/pages/')) {
    content = <CustomContentPage user={user} />;
  } else if (pathname.startsWith('/dashboard/')) {
    const [page, title, Component] = adminPages[basename] || [];
    if (!Component) content = <MissingPage />;
    else if (!user) content = <AuthPage mode="login" onLogin={setUser} />;
    else if (['products', 'users', 'cms', 'qr'].includes(page) && user.role !== 'admin') content = <DashboardShell user={user} page="dashboard" title="Overview" onLogout={() => { AuthStore.logout(); setUser(null); }}><DashboardPage user={user} /></DashboardShell>;
    else content = <DashboardShell user={user} page={page} title={title} onLogout={() => { AuthStore.logout(); setUser(null); navigate('/login.html'); }}><Component user={user} onRefresh={refresh} /></DashboardShell>;
  } else {
    content = <MissingPage />;
  }

  return <ToastProvider>{content}</ToastProvider>;
}

export default function App() {
  return <AppContent />;
}
