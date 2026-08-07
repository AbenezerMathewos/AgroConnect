import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { marketPriceService } from '../services/marketPriceService';
import ProductThumb from '../components/ProductThumb';

const emptyPriceForm = { crop: '', market: '', lowPrice: '', highPrice: '', unit: 'Kg' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [prices, setPrices] = useState([]);
  const [tab, setTab] = useState('users');
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const [priceError, setPriceError] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

  const loadAll = () => {
    Promise.all([
      adminService.getStats(),
      adminService.getUsers(),
      adminService.getProducts(),
      marketPriceService.getAll(),
    ])
      .then(([statsData, usersData, productsData, pricesData]) => {
        setStats(statsData);
        setUsers(usersData.users);
        setProducts(productsData.products);
        setPrices(pricesData.prices);
      })
      .catch(() => setError('Could not load dashboard data.'));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their products?')) return;
    setBusyId(id);
    try {
      await adminService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      loadAll();
    } catch {
      setError('Could not delete that user.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    setBusyId(id);
    try {
      await adminService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      loadAll();
    } catch {
      setError('Could not delete that product.');
    } finally {
      setBusyId(null);
    }
  };

  const handleAddPrice = async (e) => {
    e.preventDefault();
    setPriceError('');
    setSavingPrice(true);
    try {
      const { price } = await marketPriceService.create({
        ...priceForm,
        lowPrice: Number(priceForm.lowPrice),
        highPrice: Number(priceForm.highPrice),
      });
      setPrices((prev) => [price, ...prev]);
      setPriceForm(emptyPriceForm);
    } catch (err) {
      setPriceError(err.response?.data?.message || 'Could not save that price record.');
    } finally {
      setSavingPrice(false);
    }
  };

  const handleDeletePrice = async (id) => {
    if (!window.confirm('Delete this market price record?')) return;
    setBusyId(id);
    try {
      await marketPriceService.remove(id);
      setPrices((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Could not delete that price record.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="page-intro">
        <span className="eyebrow">Control center</span>
        <h1>Admin Dashboard</h1>
        <p>Oversee users, listings, and the market price board in one place.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <strong>{stats.totalUsers}</strong>
            <span>Total Users</span>
          </div>
          <div className="stat-card">
            <strong>{stats.totalFarmers}</strong>
            <span>Farmers</span>
          </div>
          <div className="stat-card">
            <strong>{stats.totalBuyers}</strong>
            <span>Buyers</span>
          </div>
          <div className="stat-card">
            <strong>{stats.totalProducts}</strong>
            <span>Total Products</span>
          </div>
        </div>
      )}

      <div className="admin-tabs">
        <button onClick={() => setTab('users')} disabled={tab === 'users'}>
          Manage Users
        </button>
        <button onClick={() => setTab('products')} disabled={tab === 'products'}>
          Manage Products
        </button>
        <button onClick={() => setTab('prices')} disabled={tab === 'prices'}>
          Market Prices
        </button>
      </div>

      {tab === 'users' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge badge-role-${u.role}`}>{u.role}</span>
                </td>
                <td>
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDeleteUser(u._id)} disabled={busyId === u._id}>
                      {busyId === u._id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'products' && (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Category</th>
              <th>Owner</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <ProductThumb product={p} />
                </td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.owner?.name}</td>
                <td>{p.price} ETB</td>
                <td>
                  <button onClick={() => handleDeleteProduct(p._id)} disabled={busyId === p._id}>
                    {busyId === p._id ? 'Deleting...' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'prices' && (
        <div className="admin-prices">
          <form className="filters-form price-add-form" onSubmit={handleAddPrice}>
            {priceError && <p className="form-error">{priceError}</p>}
            <input
              required
              placeholder="Crop, e.g. Maize"
              value={priceForm.crop}
              onChange={(e) => setPriceForm({ ...priceForm, crop: e.target.value })}
            />
            <input
              required
              placeholder="Market, e.g. Sodo"
              value={priceForm.market}
              onChange={(e) => setPriceForm({ ...priceForm, market: e.target.value })}
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Low price"
              value={priceForm.lowPrice}
              onChange={(e) => setPriceForm({ ...priceForm, lowPrice: e.target.value })}
            />
            <input
              required
              type="number"
              min="0"
              placeholder="High price"
              value={priceForm.highPrice}
              onChange={(e) => setPriceForm({ ...priceForm, highPrice: e.target.value })}
            />
            <input
              placeholder="Unit"
              value={priceForm.unit}
              onChange={(e) => setPriceForm({ ...priceForm, unit: e.target.value })}
            />
            <button className="btn btn-primary" disabled={savingPrice}>
              {savingPrice ? 'Saving...' : 'Add price'}
            </button>
          </form>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Market</th>
                <th>Range</th>
                <th>Recorded</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {prices.map((price) => (
                <tr key={price._id}>
                  <td>{price.crop}</td>
                  <td>{price.market}</td>
                  <td>
                    {price.lowPrice}&ndash;{price.highPrice} ETB/{price.unit}
                  </td>
                  <td>{new Date(price.recordedAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeletePrice(price._id)} disabled={busyId === price._id}>
                      {busyId === price._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
              {prices.length === 0 && (
                <tr>
                  <td colSpan={5}>No market price records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}