import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { productService } from '../services/productService';
import ProductThumb from '../components/ProductThumb';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = () => {
    setLoading(true);
    productService
      .getMine()
      .then((data) => setProducts(data.products || []))
      .catch(() => setError('Could not load your listings.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await productService.remove(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError('Could not delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Compute Farmer Dashboard Metrics
  const totalListings = products.length;
  const availableListings = products.filter((p) => p.isAvailable).length;
  const coopLots = products.filter((p) => p.isCooperativePooled).length;
  const totalValue = products.reduce((acc, p) => acc + (p.price * (p.quantity || 1)), 0);

  return (
    <div className="farmer-dashboard">
      {/* Dashboard Welcome Header */}
      <div className="page-intro">
        <div className="badge-row-header">
          <span className="eyebrow">{t('myDashboard')}</span>
          <span className="badge badge-grade">📍 {user?.region || 'Ethiopia'}</span>
          {user?.cooperative && (
            <span className="badge badge-coop">🏢 {user.cooperative}</span>
          )}
        </div>
        <h1>Welcome, {user?.name}</h1>
        <p>Manage your harvest inventory, monitor active listings, and connect with national buyers.</p>
      </div>

      {/* Metrics Summary Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <strong>{totalListings}</strong>
          <span>Total Harvest Listings</span>
        </div>
        <div className="stat-card">
          <strong className="text-gain">{availableListings}</strong>
          <span>Active in Marketplace</span>
        </div>
        <div className="stat-card">
          <strong>{coopLots}</strong>
          <span>Cooperative Pooled Lots</span>
        </div>
        <div className="stat-card">
          <strong>{totalValue.toLocaleString()} ETB</strong>
          <span>Estimated Inventory Value</span>
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="dashboard-actions-bar">
        <Link to="/farmer/products/add" className="btn btn-primary">
          + Add New Harvest Listing
        </Link>
        <Link to="/orders" className="btn btn-secondary">
          📦 View Orders & Escrow
        </Link>
        <Link to="/market-prices" className="btn btn-secondary">
          📊 Check Market Price Radar
        </Link>
        <Link to="/freight" className="btn btn-secondary">
          🚚 Find Return-Trip Trucks
        </Link>
      </div>

      <div className="section-header-flex">
        <div>
          <h2>My Harvest Listings</h2>
          <p className="subtext">All commodities currently listed on the national marketplace</p>
        </div>
        <button onClick={loadProducts} className="btn btn-ghost btn-sm" title="Refresh Listings">
          🔄 Refresh
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {loading ? (
        <div className="page-loading">Loading your harvest listings...</div>
      ) : products.length === 0 ? (
        <div className="empty-card">
          <span className="empty-icon">🌾</span>
          <h3>No harvest listings yet</h3>
          <p>Post your first single crop harvest or union pool lot to start receiving direct buyer orders with Telebirr escrow.</p>
          <Link to="/farmer/products/add" className="btn btn-primary mt-3">
            + Add First Listing Now
          </Link>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="my-products-table">
            <thead>
              <tr>
                <th>Crop Media</th>
                <th>Harvest Title</th>
                <th>Category</th>
                <th>Quality Grade</th>
                <th>Unit Price</th>
                <th>Available Stock</th>
                <th>Location</th>
                <th>Market Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <ProductThumb product={product} />
                  </td>
                  <td>
                    <Link to={`/products/${product._id}`} className="product-table-title">
                      {product.title}
                    </Link>
                    {product.isCooperativePooled && (
                      <span className="badge badge-coop table-tag">Union Lot</span>
                    )}
                  </td>
                  <td>
                    <span className="table-category">{product.category}</span>
                  </td>
                  <td>
                    <span className="badge badge-grade">{product.grade || 'Standard'}</span>
                  </td>
                  <td>
                    <strong>{product.price.toLocaleString()} ETB</strong>
                  </td>
                  <td>
                    {product.quantity} {product.unit || 'Kg'}
                  </td>
                  <td>
                    <small>📍 {product.location || user?.region || 'Ethiopia'}</small>
                  </td>
                  <td>
                    <span className={product.isAvailable ? 'badge badge-accepted' : 'badge badge-muted'}>
                      {product.isAvailable ? '● Active' : '○ Sold Out'}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link to={`/farmer/products/${product._id}/edit`} className="btn-table-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="btn-table-delete"
                    >
                      {deletingId === product._id ? '...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}