import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Box, Check, ChevronDown, ClipboardList,
  Download, Edit3, Eye, FileText, Image, Plus, QrCode, Save, Search, ShoppingBag,
  Trash2, TrendingUp, Users as UsersIcon, X,
} from 'lucide-react';
import { AuthStore, CartStore, CmsStore, OrderStore, ProductStore, UserStore, formatCurrency, formatDate } from './scripts/store.js';
import { useToast } from './components/toast.jsx';
import { Badge, Button, Card, Dialog, Field, Input, Select, Textarea } from './components/ui.jsx';

function Heading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Kpi({ label, value, note, icon: Icon, tone = 'blue', trend }) {
  return <Card className="kpi-card"><div className={`kpi-icon kpi-${tone}`}><Icon size={19} /></div><span className="kpi-label">{label}</span><strong className="kpi-value">{value}</strong><div className="kpi-note">{trend && <span className="trend"><ArrowUpRight size={13} />{trend}</span>}{note}</div></Card>;
}

function money(value) {
  return formatCurrency(Number(value) || 0);
}

function useRefresh() {
  const [, setVersion] = useState(0);
  return () => setVersion((version) => version + 1);
}

function Empty({ icon: Icon = Box, title, children }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={23} /></span><h3>{title}</h3><p>{children}</p></div>;
}

export function DashboardPage({ user }) {
  const orders = OrderStore.getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const products = ProductStore.getAll();
  const users = UserStore.getAll();
  const revenue = orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0);
  const recent = orders.slice(0, 5);
  const statusProgress = { confirmed: 24, processing: 54, shipped: 80, delivered: 100, cancelled: 0 };
  const maxOrder = Math.max(...orders.map((order) => order.total || 0), 1);
  return <>
    <Heading eyebrow="YOUR STORE AT A GLANCE" title={`Good ${new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, ${user.name.split(' ')[0]}`} description="Here’s what’s happening in your store today." action={<Button variant="outline" onClick={() => window.print()}><Download size={16} /> Export overview</Button>} />
    <section className="kpi-grid">
      <Kpi label="Total revenue" value={money(revenue)} note="Excluding cancelled orders" icon={TrendingUp} trend="Store total" />
      <Kpi label="Orders" value={orders.length} note={`${orders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length} need attention`} icon={ShoppingBag} tone="violet" />
      <Kpi label="Products" value={products.length} note={`${products.filter((p) => p.stock < 10).length} low in stock`} icon={Box} tone="amber" />
      <Kpi label="Customers" value={Math.max(0, users.filter((u) => u.role !== 'admin').length)} note="Registered accounts" icon={UsersIcon} tone="green" />
    </section>
    <section className="dashboard-grid">
      <Card className="panel chart-panel">
        <div className="panel-heading"><div><div className="eyebrow">PERFORMANCE</div><h2>Order activity</h2></div><a className="text-link" href="/dashboard/orders.html">View orders <ArrowRight size={15} /></a></div>
        <div className="chart-total"><strong>{orders.length}</strong><span>orders in your store</span></div>
        <div className="activity-chart">
          <div className="chart-scale"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
          <svg viewBox="0 0 620 190" preserveAspectRatio="none" role="img" aria-label="Illustrative order activity trend">
            <defs><linearGradient id="area-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#477fe4" stopOpacity=".18" /><stop offset="1" stopColor="#477fe4" stopOpacity="0" /></linearGradient></defs>
            <path d="M0 155 C80 145 88 115 155 126 S230 155 310 88 S425 120 480 70 S560 105 620 35 L620 190 L0 190Z" fill="url(#area-fill)" />
            <path d="M0 155 C80 145 88 115 155 126 S230 155 310 88 S425 120 480 70 S560 105 620 35" fill="none" stroke="#477fe4" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <path d="M0 120 C72 123 94 145 155 139 S235 95 310 121 S416 148 480 119 S555 133 620 96" fill="none" stroke="#a1b99f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <circle cx="480" cy="70" r="5" fill="#fff" stroke="#477fe4" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="chart-xlabels"><span>Earlier</span><span>Recent</span><span>Latest</span></div>
        <div className="chart-legend"><span><i className="legend-blue" /> Orders</span><span><i className="legend-sage" /> Fulfilled</span></div>
      </Card>
      <Card className="panel calendar-panel">
        <div className="panel-heading"><div><div className="eyebrow">SCHEDULE</div><h2>Calendar & updates</h2></div><Badge>{new Intl.DateTimeFormat('en-IN', { month: 'short', year: 'numeric' }).format(new Date())}</Badge></div>
        <Calendar />
        <div className="updates-title">Recent order updates</div>
        {recent.slice(0, 3).map((order, index) => <div className="order-update" key={order.id}><i className={`update-rail rail-${index}`} /><div><b>Order {order.id}</b><span>{order.status} · {formatDate(order.createdAt)}</span></div></div>)}
        {!recent.length && <p className="muted-small">New orders will appear here.</p>}
      </Card>
    </section>
    <Card className="panel pipeline-panel">
      <div className="panel-heading"><div><div className="eyebrow">FULFILLMENT</div><h2>Order pipeline</h2></div><a className="text-link" href="/dashboard/orders.html">Manage orders <ArrowRight size={15} /></a></div>
      {recent.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Order</th><th>Placed</th><th>Items</th><th>Status</th><th>Progress</th></tr></thead><tbody>{recent.map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{formatDate(order.createdAt)}</td><td>{order.items?.length || 0} items</td><td><Badge tone={order.status}>{order.status}</Badge></td><td><div className="progress-track"><span style={{ width: `${statusProgress[order.status] ?? 0}%` }} /></div></td></tr>)}</tbody></table></div> : <Empty icon={ClipboardList} title="No orders yet">Orders are listed here when customers place them.</Empty>}
    </Card>
    <section className="dashboard-lower-grid">
      <Card className="panel"><div className="panel-heading"><div><div className="eyebrow">INVENTORY</div><h2>Stock to watch</h2></div><a className="text-link" href="/dashboard/products.html">Manage products <ArrowRight size={15} /></a></div>{products.filter((p) => p.stock < 20).slice(0, 4).map((product) => <div className="inventory-row" key={product.id}><img src={product.image} alt="" /><div><b>{product.name}</b><span>{product.category}</span></div><Badge tone={product.stock === 0 ? 'cancelled' : 'processing'}>{product.stock} left</Badge></div>)}</Card>
      <Card className="panel"><div className="panel-heading"><div><div className="eyebrow">TOP PRODUCTS</div><h2>Popular this week</h2></div><span className="panel-icon"><TrendingUp size={17} /></span></div>{[...products].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 4).map((product, index) => <div className="popular-row" key={product.id}><span className="popular-index">0{index + 1}</span><img src={product.image} alt="" /><div><b>{product.name}</b><span>{product.reviews || 0} customer reviews</span></div><strong>{money(product.price)}</strong></div>)}</Card>
    </section>
  </>;
}

function Calendar() {
  const now = new Date();
  const offset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return <div className="calendar-widget"><div className="calendar-week">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d}>{d}</span>)}</div><div className="calendar-days">{Array.from({ length: offset }, (_, i) => <span key={`blank-${i}`} />)}{Array.from({ length: days }, (_, i) => <span className={i + 1 === now.getDate() ? 'today' : ''} key={i}>{i + 1}</span>)}</div></div>;
}

export function ProductsPage() {
  const notify = useToast();
  const refresh = useRefresh();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const products = ProductStore.getAll().filter((p) => (!search || `${p.name} ${p.sku}`.toLowerCase().includes(search.toLowerCase())) && (category === 'all' || p.category === category));
  const blankProduct = { name: '', description: '', price: '', originalPrice: '', category: '', brand: '', sku: '', stock: 0, image: '', active: true };
  const edit = (product = blankProduct) => setEditing({ ...product });
  const save = (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...values, price: Number(values.price), originalPrice: Number(values.originalPrice) || 0, stock: Number(values.stock), active: values.active === 'on' };
    if (!payload.name || payload.price < 0 || payload.stock < 0) return notify('Enter a product name, price, and valid stock value.', 'warning');
    if (editing.id) ProductStore.update(editing.id, payload);
    else ProductStore.create(payload);
    setEditing(null);
    refresh();
    notify('Product saved.');
  };
  return <>
    <Heading eyebrow="CATALOG MANAGEMENT" title="Products" description="Manage your catalog, pricing and stock." action={<Button onClick={() => edit()}><Plus size={17} /> Add product</Button>} />
    <section className="kpi-grid kpi-grid-3"><Kpi label="Products" value={ProductStore.getStats().total} note="Across all categories" icon={Box} /><Kpi label="Active listings" value={ProductStore.getStats().active} note="Visible in the store" icon={Check} tone="green" /><Kpi label="Low stock" value={ProductStore.getStats().lowStock} note="Below 10 units" icon={ArrowDownRight} tone="amber" /></section>
    <Card className="panel"><div className="toolbar"><label className="toolbar-search"><Search size={16} /><Input placeholder="Search products or SKU" value={search} onChange={(e) => setSearch(e.target.value)} /></label><Select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All categories</option>{ProductStore.getCategories().map((item) => <option key={item}>{item}</option>)}</Select></div>
      {products.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><div className="table-product"><img src={product.image || '/assets/images/product-placeholder.svg'} alt="" /><div><b>{product.name}</b><span>{product.sku || product.brand}</span></div></div></td><td>{product.category}</td><td><b>{money(product.price)}</b></td><td>{product.stock}</td><td><Badge tone={product.active ? 'delivered' : 'cancelled'}>{product.active ? 'Active' : 'Hidden'}</Badge></td><td><div className="table-actions"><Button variant="ghost" size="icon" aria-label="Edit product" onClick={() => edit(product)}><Edit3 size={16} /></Button><Button variant="ghost" size="icon" aria-label="Toggle product visibility" onClick={() => { ProductStore.update(product.id, { active: !product.active }); refresh(); }}><Eye size={16} /></Button><Button variant="ghost" size="icon" className="danger-icon" aria-label="Delete product" onClick={() => setConfirmDelete(product)}><Trash2 size={16} /></Button></div></td></tr>)}</tbody></table></div> : <Empty title="No matching products">Add products or adjust your search filters.</Empty>}
    </Card>
    <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)} title={editing?.id ? 'Edit product' : 'Add a product'} description="Product details are saved to this browser.">
      {editing && <form className="form-grid" onSubmit={save}><Field label="Product name"><Input name="name" defaultValue={editing.name} required /></Field><Field label="Category"><Input name="category" defaultValue={editing.category} required /></Field><Field label="Price (₹)"><Input name="price" type="number" min="0" step="0.01" defaultValue={editing.price} required /></Field><Field label="Original price (₹)"><Input name="originalPrice" type="number" min="0" step="0.01" defaultValue={editing.originalPrice} /></Field><Field label="Stock"><Input name="stock" type="number" min="0" defaultValue={editing.stock} required /></Field><Field label="SKU"><Input name="sku" defaultValue={editing.sku} /></Field><Field label="Brand"><Input name="brand" defaultValue={editing.brand} /></Field><Field label="Image URL"><Input name="image" defaultValue={editing.image} /></Field><Field label="Description"><Textarea name="description" defaultValue={editing.description} /></Field><div className="dialog-actions"><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit"><Save size={16} /> Save product</Button></div></form>}
    </Dialog>
    <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)} title="Delete product?" description={`This removes ${confirmDelete?.name || 'this product'} from the catalog.`}><div className="dialog-actions"><Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button><Button variant="destructive" onClick={() => { ProductStore.delete(confirmDelete.id); setConfirmDelete(null); refresh(); notify('Product deleted.', 'warning'); }}><Trash2 size={16} /> Delete product</Button></div></Dialog>
  </>;
}

export function OrdersPage({ user }) {
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const notify = useToast();
  const refresh = useRefresh();
  const isAdmin = user.role === 'admin';
  const orders = (isAdmin ? OrderStore.getAll() : OrderStore.getUserOrders(user.id)).filter((order) => (status === 'all' || order.status === status) && (!query || order.id.toLowerCase().includes(query.toLowerCase()))).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const advance = (order, next) => {
    OrderStore.updateStatus(order.id, next);
    refresh();
    notify(`Order ${order.id} updated.`);
  };
  return <>
    <Heading eyebrow="STORE OPERATIONS" title={isAdmin ? 'Orders' : 'Your orders'} description={isAdmin ? 'Review purchases and keep orders moving.' : 'Track your purchases and delivery status.'} />
    {isAdmin && <div className="kpi-grid kpi-grid-3"><Kpi label="Total orders" value={OrderStore.getStats().total} note="All time" icon={ShoppingBag} /><Kpi label="In progress" value={orders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.status)).length} note="Awaiting fulfillment" icon={ClipboardList} tone="amber" /><Kpi label="Revenue" value={money(OrderStore.getStats().revenue)} note="Order value" icon={TrendingUp} tone="green" /></div>}
    <Card className="panel"><div className="toolbar"><label className="toolbar-search"><Search size={16} /><Input placeholder="Search order ID" value={query} onChange={(e) => setQuery(e.target.value)} /></label><Select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((item) => <option key={item} value={item}>{item[0].toUpperCase() + item.slice(1)}</option>)}</Select></div>{orders.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Order</th>{isAdmin && <th>Customer</th>}<th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Details</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><b>{order.id}</b></td>{isAdmin && <td>{UserStore.getAll().find((customer) => customer.id === order.userId)?.name || 'Admin User'}</td>}<td>{order.items?.length || 0}</td><td><b>{money(order.total)}</b></td><td>{order.paymentMethod || 'COD'}</td><td>{isAdmin && order.status !== 'delivered' && order.status !== 'cancelled' ? <Select className="status-select" value={order.status} onChange={(e) => advance(order, e.target.value)}>{['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => <option key={s}>{s}</option>)}</Select> : <Badge tone={order.status}>{order.status}</Badge>}</td><td>{formatDate(order.createdAt)}</td><td><Button variant="outline" size="sm" onClick={() => setSelected(order)}><Eye size={15} /> View</Button></td></tr>)}</tbody></table></div> : <Empty icon={ShoppingBag} title="No orders yet">Your orders will show up here.</Empty>}</Card>
    <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)} title={`Order ${selected?.id || ''}`} description={selected ? `Placed ${formatDate(selected.createdAt)}` : ''}>{selected && <div className="order-detail-list">{selected.items?.map((item, i) => <div key={`${item.productId}-${i}`}><div><b>{item.name || item.productName}</b><span>Qty {item.qty || item.quantity}</span></div><strong>{money((item.price || 0) * (item.qty || item.quantity || 1))}</strong></div>)}<div className="order-total"><b>Total</b><strong>{money(selected.total)}</strong></div></div>}</Dialog>
  </>;
}

export function CartPage({ user, onRefresh }) {
  const navigate = useNavigate();
  const notify = useToast();
  const items = CartStore.getUserCart(user.id);
  const details = items.map((item) => ({ ...item, product: ProductStore.findById(item.productId) })).filter((item) => item.product);
  const subtotal = details.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const [checkout, setCheckout] = useState(false);
  const placeOrder = (event) => {
    event.preventDefault();
    const form = Object.fromEntries(new FormData(event.currentTarget));
    if (!form.name || !form.address || !form.city || !form.pin) return notify('Complete all delivery details.', 'warning');
    if (!/^\d{6}$/.test(String(form.pin))) return notify('Enter a valid 6-digit PIN code.', 'warning');
    const orderItems = details.map(({ product, qty }) => ({ productId: product.id, name: product.name, qty, price: product.price }));
    const order = OrderStore.create(user.id, orderItems, form.payment || 'COD');
    CartStore.clearCart(user.id);
    onRefresh();
    setCheckout(false);
    notify(`Order ${order.id} placed successfully.`);
    navigate('/dashboard/orders.html');
  };
  return <>
    <Heading eyebrow="YOUR BAG" title="Shopping cart" description="Review your items and complete your order." />
    {!details.length ? <Card className="panel"><Empty icon={ShoppingBag} title="Your cart is empty">Find something great in our store.</Empty><div className="empty-action"><Button onClick={() => navigate('/store.html')}>Explore the store <ArrowRight size={16} /></Button></div></Card> : <div className="cart-layout"><Card className="panel cart-items">{details.map(({ product, qty }) => <div className="cart-row" key={product.id}><img src={product.image} alt={product.name} /><div className="cart-item-info"><span className="product-category">{product.category}</span><b>{product.name}</b><span>{money(product.price)}</span></div><div className="quantity-control"><Button variant="outline" size="sm" onClick={() => { CartStore.updateQty(user.id, product.id, qty - 1); onRefresh(); }}>−</Button><span>{qty}</span><Button variant="outline" size="sm" onClick={() => { CartStore.updateQty(user.id, product.id, Math.min(qty + 1, product.stock)); onRefresh(); }}>+</Button></div><strong>{money(product.price * qty)}</strong><Button variant="ghost" size="icon" aria-label="Remove item" onClick={() => { CartStore.removeItem(user.id, product.id); onRefresh(); notify('Item removed.', 'warning'); }}><X size={16} /></Button></div>)}</Card><Card className="panel order-summary"><div className="eyebrow">ORDER SUMMARY</div><h2>Ready when you are</h2><div className="summary-line"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="summary-line"><span>Shipping</span><b className="success-text">Free</b></div><div className="summary-line summary-total"><span>Total</span><strong>{money(subtotal)}</strong></div><Button className="full-button" onClick={() => setCheckout(true)}>Continue to checkout <ArrowRight size={16} /></Button><p className="summary-note">Secure checkout · Easy returns</p></Card></div>}
    <Dialog open={checkout} onOpenChange={setCheckout} title="Delivery details" description="Where should we send your order?"><form className="form-grid" onSubmit={placeOrder}><Field label="Full name"><Input name="name" defaultValue={user.name} required /></Field><Field label="Phone"><Input name="phone" required /></Field><Field label="Address"><Textarea name="address" required /></Field><Field label="City"><Input name="city" required /></Field><Field label="State"><Input name="state" required /></Field><Field label="PIN code"><Input name="pin" inputMode="numeric" maxLength={6} required /></Field><Field label="Payment method"><Select name="payment"><option>COD</option><option>UPI</option><option>Credit Card</option></Select></Field><div className="dialog-actions"><Button variant="outline" onClick={() => setCheckout(false)}>Back</Button><Button type="submit">Place order · {money(subtotal)}</Button></div></form></Dialog>
  </>;
}

export function UsersPage() {
  const notify = useToast();
  const refresh = useRefresh();
  const [query, setQuery] = useState('');
  const users = UserStore.getAll().filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase()));
  return <><Heading eyebrow="PEOPLE" title="Customers" description="Manage customer accounts and store access." /><Card className="panel"><div className="toolbar"><label className="toolbar-search"><Search size={16} /><Input placeholder="Search people" value={query} onChange={(e) => setQuery(e.target.value)} /></label><Badge>{users.length} accounts</Badge></div><div className="table-scroll"><table className="data-table"><thead><tr><th>Customer</th><th>Email</th><th>Role</th><th>Joined</th><th>Total spent</th><th>Actions</th></tr></thead><tbody>{users.map((customer) => <tr key={customer.id}><td><div className="table-product"><span className="profile-avatar">{customer.name?.[0]?.toUpperCase()}</span><b>{customer.name}</b></div></td><td>{customer.email}</td><td><Badge tone={customer.role === 'admin' ? 'primary' : 'neutral'}>{customer.role}</Badge></td><td>{formatDate(customer.createdAt)}</td><td>{money(customer.totalSpent)}</td><td>{customer.role !== 'admin' && <div className="table-actions"><Button variant="outline" size="sm" onClick={() => { const next = customer.role === 'admin' ? 'user' : 'admin'; UserStore.update(customer.id, { role: next }); refresh(); notify(`Role changed to ${next}.`); }}>{customer.role === 'admin' ? 'Make customer' : 'Make admin'}</Button><Button variant="ghost" size="icon" aria-label="Delete customer" onClick={() => { if (window.confirm(`Remove ${customer.name}?`)) { UserStore.delete(customer.id); refresh(); notify('Customer removed.', 'warning'); } }}><Trash2 size={16} /></Button></div>}</td></tr>)}</tbody></table></div></Card></>;
}

export function AnalyticsPage({ user }) {
  const allOrders = OrderStore.getAll();
  const orders = user.role === 'admin' ? allOrders : OrderStore.getUserOrders(user.id);
  const products = ProductStore.getAll();
  const revenue = orders.filter((order) => order.status !== 'cancelled').reduce((sum, order) => sum + order.total, 0);
  const categories = products.reduce((acc, product) => { acc[product.category] = (acc[product.category] || 0) + product.reviews; return acc; }, {});
  const total = Math.max(1, Object.values(categories).reduce((a, b) => a + b, 0));
  return <><Heading eyebrow="INSIGHTS" title="Analytics" description={user.role === 'admin' ? 'Understand your orders, revenue and products.' : 'A clear view of your shopping activity.'} /><section className="kpi-grid kpi-grid-3"><Kpi label="Revenue" value={money(revenue)} note="Completed, non-cancelled orders" icon={TrendingUp} tone="green" /><Kpi label="Orders" value={orders.length} note="All order activity" icon={ShoppingBag} tone="violet" /><Kpi label="Average order" value={money(orders.length ? revenue / orders.length : 0)} note="Based on order history" icon={ClipboardList} /></section><section className="dashboard-grid"><Card className="panel"><div className="panel-heading"><div><div className="eyebrow">REVENUE</div><h2>Revenue distribution</h2></div><Badge tone="primary">{orders.length} orders</Badge></div><div className="revenue-visual"><div className="revenue-bars">{orders.slice(-8).map((order, i) => <div key={order.id} title={`${order.id}: ${money(order.total)}`} style={{ height: `${Math.max(8, order.total / Math.max(...orders.map((o) => o.total), 1) * 100)}%` }}><span>{i + 1}</span></div>)}</div></div></Card><Card className="panel"><div className="panel-heading"><div><div className="eyebrow">CATALOG</div><h2>Product categories</h2></div></div>{Object.entries(categories).map(([name, count]) => <div className="category-metric" key={name}><div><span>{name}</span><b>{count} reviews</b></div><div className="progress-track"><span style={{ width: `${Math.round(count / total * 100)}%` }} /></div></div>)}</Card></section><Card className="panel"><div className="panel-heading"><div><div className="eyebrow">HISTORY</div><h2>Recent orders</h2></div></div>{orders.length ? <div className="table-scroll"><table className="data-table"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><b>{order.id}</b></td><td>{formatDate(order.createdAt)}</td><td><Badge tone={order.status}>{order.status}</Badge></td><td>{money(order.total)}</td></tr>)}</tbody></table></div> : <Empty icon={ClipboardList} title="No purchase history">Your orders will be shown here.</Empty>}</Card></>;
}

export function QrPage() {
  const [selectedId, setSelectedId] = useState(ProductStore.getAll()[0]?.id || '');
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const product = ProductStore.findById(selectedId);
  React.useEffect(() => {
    let active = true;
    setError('');
    if (!product) { setQr(''); return () => { active = false; }; }
    QRCode.toDataURL(`${window.location.origin}/product-detail.html?id=${encodeURIComponent(product.id)}`, { width: 240, margin: 2, color: { dark: '#24324a', light: '#ffffff' } })
      .then((url) => { if (active) setQr(url); })
      .catch((reason) => { if (active) setError(reason.message || 'Unable to generate QR code.'); });
    return () => { active = false; };
  }, [selectedId, product?.id]);
  return <><Heading eyebrow="PRODUCT LABELS" title="QR generator" description="Create a scannable product link to print or share." /><Card className="panel qr-layout"><div className="qr-controls"><Field label="Select product"><Select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>{ProductStore.getAll().map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</Select></Field>{product && <><div className="qr-product-summary"><img src={product.image} alt="" /><div><b>{product.name}</b><span>{money(product.price)}</span></div></div><p className="muted-small">This QR code opens the product detail page on this site.</p><Button disabled={!qr} onClick={() => { const link = document.createElement('a'); link.href = qr; link.download = `${product.sku || product.id}-qr.png`; link.click(); }}><Download size={16} /> Download PNG</Button></>}{error && <div className="inline-alert alert-error">{error}</div>}</div><div className="qr-preview">{qr ? <><img src={qr} alt={`QR code for ${product?.name}`} /><b>{product?.name}</b><span>Scan to view product</span></> : <Empty icon={QrCode} title="Select a product">A printable QR label will appear here.</Empty>}</div></Card></>;
}

export function SettingsPage({ user }) {
  const notify = useToast();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const saveProfile = (event) => {
    event.preventDefault();
    if (!name.trim() || !email.trim()) return notify('Name and email are required.', 'warning');
    UserStore.update(user.id, { name: name.trim(), email: email.trim(), avatar });
    notify('Profile updated.');
    window.location.reload();
  };
  const changePassword = (event) => {
    event.preventDefault();
    const saved = UserStore.getAll().find((item) => item.id === user.id);
    if (saved?.password !== currentPassword) return notify('Current password does not match.', 'error');
    if (newPassword.length < 6) return notify('New password must be at least 6 characters.', 'warning');
    UserStore.update(user.id, { password: newPassword });
    setCurrentPassword(''); setNewPassword('');
    notify('Password changed.');
  };
  return <><Heading eyebrow="PREFERENCES" title="Settings" description="Manage your profile and account preferences." /><div className="settings-grid"><Card className="panel settings-card"><div className="panel-heading"><div><div className="eyebrow">PERSONAL DETAILS</div><h2>Your profile</h2></div></div><form className="stack-form" onSubmit={saveProfile}><Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field><Field label="Email address"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field><Field label="Avatar image URL"><Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." /></Field><Button type="submit"><Save size={16} /> Save profile</Button></form></Card><Card className="panel settings-card"><div className="panel-heading"><div><div className="eyebrow">ACCOUNT SECURITY</div><h2>Change password</h2></div></div><form className="stack-form" onSubmit={changePassword}><Field label="Current password"><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></Field><Field label="New password"><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} required /></Field><Button type="submit" variant="outline">Update password</Button></form><div className="settings-account"><span>Account role</span><Badge tone={user.role === 'admin' ? 'primary' : 'neutral'}>{user.role}</Badge></div><div className="settings-account"><span>Member since</span><b>{formatDate(user.createdAt)}</b></div></Card></div></>;
}

export function CmsPage() {
  const notify = useToast();
  const [data, setData] = useState(() => CmsStore.get());
  const [tab, setTab] = useState('branding');
  const update = (section, key, value) => setData((current) => ({ ...current, [section]: { ...current[section], [key]: value } }));
  const editArrayItem = (section, index, key, value) => setData((current) => ({ ...current, [section]: { ...current[section], items: current[section].items.map((item, i) => i === index ? { ...item, [key]: value } : item) } }));
  const save = () => { try { CmsStore.save(data); notify('Website content saved.'); } catch (error) { console.error(error); notify('Could not save website content.', 'error'); } };
  const reset = () => { if (!window.confirm('Reset all website content to defaults?')) return; setData(CmsStore.reset()); notify('Website content reset.', 'warning'); };
  const addPage = () => {
    const title = window.prompt('Page title');
    if (!title?.trim()) return;
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug || data.pages.some((page) => page.slug === slug)) return notify('That page URL already exists.', 'error');
    setData((current) => ({ ...current, pages: [...current.pages, { id: `page-${Date.now()}`, title: title.trim(), slug, published: true, showInNav: false, sections: [{ id: `section-${Date.now()}`, type: 'text', title: 'Welcome', body: 'Add your content here.' }] }] }));
  };
  const changePage = (index, key, value) => setData((current) => ({ ...current, pages: current.pages.map((page, i) => i === index ? { ...page, [key]: value } : page) }));
  const changeSection = (pageIndex, sectionIndex, key, value) => setData((current) => ({ ...current, pages: current.pages.map((page, pi) => pi !== pageIndex ? page : { ...page, sections: page.sections.map((section, si) => si === sectionIndex ? { ...section, [key]: value } : section) }) }));
  const tabs = [['branding', 'Branding'], ['navigation', 'Navigation & visibility'], ['announcement', 'Announcement'], ['hero', 'Hero'], ['features', 'Features'], ['testimonials', 'Testimonials'], ['cta', 'Call to action'], ['footer', 'Footer'], ['pages', 'Page builder']];
  const navChange = (index, key, value) => setData((current) => ({ ...current, navigation: current.navigation.map((item, i) => i === index ? { ...item, [key]: value } : item) }));
  return <><Heading eyebrow="SITE ADMINISTRATION" title="Website CMS" description="Edit your storefront content and build additional pages." action={<div className="heading-actions"><Button variant="outline" onClick={() => window.open('/index.html', '_blank', 'noopener')}>Preview website</Button><Button variant="outline" onClick={reset}>Reset defaults</Button><Button onClick={save}><Save size={16} /> Save changes</Button></div>} /><div className="cms-layout"><Card className="cms-tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? 'cms-tab active' : 'cms-tab'} onClick={() => setTab(id)}>{label}</button>)}</Card><Card className="panel cms-editor">
    {tab === 'branding' && <><div className="panel-heading"><div><div className="eyebrow">IDENTITY</div><h2>Store identity</h2></div></div><div className="form-grid"><Field label="Store name"><Input value={data.branding.storeName} onChange={(e) => update('branding', 'storeName', e.target.value)} /></Field><Field label="Tagline"><Input value={data.branding.tagLine} onChange={(e) => update('branding', 'tagLine', e.target.value)} /></Field><Field label="Support email"><Input type="email" value={data.branding.supportEmail} onChange={(e) => update('branding', 'supportEmail', e.target.value)} /></Field><Field label="Support phone"><Input value={data.branding.supportPhone} onChange={(e) => update('branding', 'supportPhone', e.target.value)} /></Field><Field label="Currency symbol"><Input value={data.branding.currency} onChange={(e) => update('branding', 'currency', e.target.value)} /></Field><Field label="Brand color"><Input type="color" value={data.branding.themeColor} onChange={(e) => update('branding', 'themeColor', e.target.value)} /></Field></div></>}
    {tab === 'announcement' && <><div className="panel-heading"><div><div className="eyebrow">PROMOTION</div><h2>Announcement bar</h2></div></div><div className="form-grid"><label className="toggle-row"><input type="checkbox" checked={!!data.announcement.active} onChange={(e) => update('announcement', 'active', e.target.checked)} /> Show the announcement</label><Field label="Badge"><Input value={data.announcement.badge} onChange={(e) => update('announcement', 'badge', e.target.value)} /></Field><Field label="Message"><Input value={data.announcement.text} onChange={(e) => update('announcement', 'text', e.target.value)} /></Field><Field label="Link"><Input value={data.announcement.link} onChange={(e) => update('announcement', 'link', e.target.value)} /></Field></div></>}
    {tab === 'hero' && <><div className="panel-heading"><div><div className="eyebrow">LANDING PAGE</div><h2>Hero content and actions</h2></div></div><div className="form-grid"><Field label="Badge"><Input value={data.hero.badge} onChange={(e) => update('hero', 'badge', e.target.value)} /></Field><Field label="Headline"><Input value={data.hero.titleLine1} onChange={(e) => update('hero', 'titleLine1', e.target.value)} /></Field><Field label="Highlight"><Input value={data.hero.highlight} onChange={(e) => update('hero', 'highlight', e.target.value)} /></Field><Field label="Headline second line"><Input value={data.hero.titleLine2} onChange={(e) => update('hero', 'titleLine2', e.target.value)} /></Field><Field label="Description"><Textarea value={data.hero.subtitle} onChange={(e) => update('hero', 'subtitle', e.target.value)} /></Field><Field label="Primary button text"><Input value={data.hero.ctaPrimaryText} onChange={(e) => update('hero', 'ctaPrimaryText', e.target.value)} /></Field><Field label="Primary button link"><Input value={data.hero.ctaPrimaryLink} onChange={(e) => update('hero', 'ctaPrimaryLink', e.target.value)} /></Field><Field label="Secondary button text"><Input value={data.hero.ctaSecondaryText} onChange={(e) => update('hero', 'ctaSecondaryText', e.target.value)} /></Field><Field label="Secondary button link"><Input value={data.hero.ctaSecondaryLink} onChange={(e) => update('hero', 'ctaSecondaryLink', e.target.value)} /></Field></div></>}
    {tab === 'navigation' && <><div className="panel-heading"><div><div className="eyebrow">PUBLIC LINKS</div><h2>Navigation and page visibility</h2></div><Button variant="outline" size="sm" onClick={() => setData((current) => ({ ...current, navigation: [...current.navigation, { id: `nav-${Date.now()}`, label: 'New link', href: '/store.html', visible: true }] }))}><Plus size={15} /> Add link</Button></div>{data.navigation.map((item, index) => <div className="cms-list-row" key={item.id}><Input value={item.label} aria-label="Navigation label" onChange={(e) => navChange(index, 'label', e.target.value)} /><Input value={item.href} aria-label="Navigation destination" onChange={(e) => navChange(index, 'href', e.target.value)} /><label className="toggle-row"><input type="checkbox" checked={item.visible !== false} onChange={(e) => navChange(index, 'visible', e.target.checked)} />Visible</label><Button variant="ghost" size="icon" onClick={() => setData((current) => ({ ...current, navigation: current.navigation.filter((_, i) => i !== index) }))}><Trash2 size={15} /></Button></div>)}<div className="visibility-grid">{Object.entries(data.visibility).map(([key, value]) => <label className="toggle-row" key={key}><input type="checkbox" checked={value !== false} onChange={(e) => update('visibility', key, e.target.checked)} /> Show {key}</label>)}</div></>}
    {tab === 'features' && <><div className="panel-heading"><div><div className="eyebrow">LANDING PAGE</div><h2>Feature cards</h2></div><Button variant="outline" size="sm" onClick={() => update('features', 'items', [...data.features.items, { id: `feature-${Date.now()}`, title: 'New feature', description: 'Describe this feature.', icon: 'bi-stars' }])}><Plus size={15} /> Add feature</Button></div><div className="form-grid cms-section-heading"><Field label="Section badge"><Input value={data.features.sectionBadge} onChange={(e) => update('features', 'sectionBadge', e.target.value)} /></Field><Field label="Section title"><Input value={data.features.sectionTitle} onChange={(e) => update('features', 'sectionTitle', e.target.value)} /></Field><Field label="Section description"><Input value={data.features.sectionSubtitle} onChange={(e) => update('features', 'sectionSubtitle', e.target.value)} /></Field></div>{data.features.items.map((item, index) => <div className="cms-edit-card" key={item.id}><Field label="Title"><Input value={item.title} onChange={(e) => editArrayItem('features', index, 'title', e.target.value)} /></Field><Field label="Description"><Textarea value={item.description} onChange={(e) => editArrayItem('features', index, 'description', e.target.value)} /></Field><Button variant="ghost" className="danger-text" onClick={() => update('features', 'items', data.features.items.filter((_, i) => i !== index))}><Trash2 size={15} /> Remove</Button></div>)}</>}
    {tab === 'testimonials' && <><div className="panel-heading"><div><div className="eyebrow">LANDING PAGE</div><h2>Testimonials</h2></div><Button variant="outline" size="sm" onClick={() => update('testimonials', 'items', [...data.testimonials.items, { id: `review-${Date.now()}`, name: 'Customer', shop: 'Store, City', rating: 5, review: 'Write a customer review.' }])}><Plus size={15} /> Add review</Button></div><div className="form-grid"><Field label="Section badge"><Input value={data.testimonials.sectionBadge} onChange={(e) => update('testimonials', 'sectionBadge', e.target.value)} /></Field><Field label="Section title"><Input value={data.testimonials.sectionTitle} onChange={(e) => update('testimonials', 'sectionTitle', e.target.value)} /></Field></div>{data.testimonials.items.map((item, index) => <div className="cms-edit-card" key={item.id}><div className="form-grid"><Field label="Name"><Input value={item.name} onChange={(e) => editArrayItem('testimonials', index, 'name', e.target.value)} /></Field><Field label="Shop"><Input value={item.shop} onChange={(e) => editArrayItem('testimonials', index, 'shop', e.target.value)} /></Field><Field label="Review"><Textarea value={item.review} onChange={(e) => editArrayItem('testimonials', index, 'review', e.target.value)} /></Field></div><Button variant="ghost" className="danger-text" onClick={() => update('testimonials', 'items', data.testimonials.items.filter((_, i) => i !== index))}><Trash2 size={15} /> Remove</Button></div>)}</>}
    {tab === 'cta' && <><div className="panel-heading"><div><div className="eyebrow">LANDING PAGE</div><h2>Call to action</h2></div></div><div className="form-grid">{[['badge', 'Badge'], ['title', 'Title'], ['subtitle', 'Description'], ['btnPrimaryText', 'Primary button'], ['btnPrimaryLink', 'Primary link'], ['btnSecondaryText', 'Secondary button'], ['btnSecondaryLink', 'Secondary link']].map(([key, label]) => <Field label={label} key={key}>{key === 'subtitle' ? <Textarea value={data.cta[key]} onChange={(e) => update('cta', key, e.target.value)} /> : <Input value={data.cta[key]} onChange={(e) => update('cta', key, e.target.value)} />}</Field>)}</div></>}
    {tab === 'footer' && <><div className="panel-heading"><div><div className="eyebrow">PUBLIC WEBSITE</div><h2>Footer content</h2></div></div><div className="form-grid"><Field label="About text"><Textarea value={data.footer.about} onChange={(e) => update('footer', 'about', e.target.value)} /></Field><Field label="Copyright"><Input value={data.footer.copyright} onChange={(e) => update('footer', 'copyright', e.target.value)} /></Field></div></>}
    {tab === 'pages' && <><div className="panel-heading"><div><div className="eyebrow">CUSTOM PAGES</div><h2>Page builder</h2></div><Button variant="outline" onClick={addPage}><Plus size={16} /> Create page</Button></div>{data.pages.map((page, pageIndex) => <div className="cms-edit-card" key={page.id}><div className="form-grid"><Field label="Page title"><Input value={page.title} onChange={(e) => changePage(pageIndex, 'title', e.target.value)} /></Field><Field label="URL slug"><Input value={page.slug} onChange={(e) => changePage(pageIndex, 'slug', e.target.value)} /></Field></div><div className="page-builder-options"><label className="toggle-row"><input type="checkbox" checked={page.published} onChange={(e) => changePage(pageIndex, 'published', e.target.checked)} /> Published</label><label className="toggle-row"><input type="checkbox" checked={page.showInNav} onChange={(e) => changePage(pageIndex, 'showInNav', e.target.checked)} /> Show in navigation</label><a href={`/content-page.html?slug=${encodeURIComponent(page.slug)}`} target="_blank" rel="noreferrer">Preview page</a><Button variant="ghost" className="danger-text" onClick={() => setData((current) => ({ ...current, pages: current.pages.filter((_, i) => i !== pageIndex) }))}><Trash2 size={15} /> Remove</Button></div>{(page.sections || []).map((section, sectionIndex) => <div className="cms-section-edit" key={section.id}><Field label="Section heading"><Input value={section.title} onChange={(e) => changeSection(pageIndex, sectionIndex, 'title', e.target.value)} /></Field><Field label="Content"><Textarea value={section.body} onChange={(e) => changeSection(pageIndex, sectionIndex, 'body', e.target.value)} /></Field><Button variant="ghost" className="danger-text" onClick={() => changePage(pageIndex, 'sections', page.sections.filter((_, i) => i !== sectionIndex))}><Trash2 size={15} /> Remove section</Button></div>)}<Button variant="outline" size="sm" onClick={() => changePage(pageIndex, 'sections', [...(page.sections || []), { id: `section-${Date.now()}`, type: 'text', title: 'New section', body: '' }])}><Plus size={14} /> Add section</Button></div>)}</>}
  </Card></div><div className="cms-save-row"><span>Remember to save your edits before leaving.</span><Button onClick={save}><Save size={16} /> Save changes</Button></div></>;
}
